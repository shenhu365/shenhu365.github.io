import { readFile, realpath, stat, readdir } from 'node:fs/promises';
import { dirname, extname, relative, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { publicationPage, renderPublications, syncPublicationsHtml } from './sync-publications.mjs';

const root = await realpath(resolve(dirname(fileURLToPath(import.meta.url)), '..'));
const errors = [];
const documents = new Map();
const references = [];
const contentPages = ['index.html', 'publications/index.html'];
const redirectPages = ['publications.html'];
const pageFiles = [...contentPages, ...redirectPages];
const staticFiles = new Set([...pageFiles.map(filename => filename.split('/')[0]), 'styles.css', 'app.js', 'data.js', 'people.js', 'publication-renderer.js', 'assets', '.nojekyll']);
const fail = message => errors.push(message);

async function read(name) {
  try {
    return await readFile(resolve(root, name), 'utf8');
  } catch (error) {
    fail(`${name}: ${error.message}`);
    return '';
  }
}

function parseHtml(source, filename) {
  const ids = new Set();
  for (const match of source.matchAll(/\bid\s*=\s*(["'])(.*?)\1/gis)) {
    if (ids.has(match[2])) fail(`${filename}: duplicate id ${match[2]}`);
    ids.add(match[2]);
  }
  documents.set(filename, ids);
  for (const match of source.matchAll(/\b(?:href|src|poster)\s*=\s*(["'])(.*?)\1/gis)) {
    references.push({ value: match[2].replaceAll('&amp;', '&'), from: filename });
  }
  for (const match of source.matchAll(/<meta\b[^>]*>/gi)) {
    if (!/\bhttp-equiv\s*=\s*(["'])refresh\1/i.test(match[0])) continue;
    const content = match[0].match(/\bcontent\s*=\s*(["'])(.*?)\1/i)?.[2];
    const target = content?.match(/^\s*\d+(?:\.\d+)?\s*;\s*url\s*=\s*(.+?)\s*$/i)?.[1];
    if (!target) fail(`${filename}: meta refresh must contain a redirect URL.`);
    else references.push({ value: target.replace(/^(["'])(.*)\1$/, '$2').replaceAll('&amp;', '&'), from: filename, label: `${filename}: meta refresh` });
  }
  for (const match of source.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(match[1]); } catch (error) { fail(`${filename}: invalid JSON-LD: ${error.message}`); }
  }
  if (!contentPages.includes(filename)) return;
  const scripts = [...source.matchAll(/<script\b[^>]*\bsrc\s*=\s*(["'])(.*?)\1[^>]*>/gi)]
    .map(match => relative(root, resolve(root, dirname(filename), match[2].split(/[?#]/)[0])));
  const requiredScripts = ['people.js', 'data.js', 'publication-renderer.js', 'app.js'];
  for (const script of requiredScripts) {
    if (!scripts.includes(script)) fail(`${filename}: missing required script ${script}.`);
  }
  if (requiredScripts.every(script => scripts.includes(script)) &&
      !requiredScripts.every((script, index) => index === 0 || scripts.indexOf(requiredScripts[index - 1]) < scripts.indexOf(script))) {
    fail(`${filename}: load scripts in this order: ${requiredScripts.join(' → ')}.`);
  }
}

const css = await read('styles.css');
const dataSource = await read('data.js');
const peopleSource = await read('people.js');
await read('.nojekyll');
const pages = await Promise.all(pageFiles.map(async filename => ({ filename, source: await read(filename) })));
for (const { filename, source } of pages) parseHtml(source, filename);

for (const match of css.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gi)) {
  if (!match[2].startsWith('#')) references.push({ value: match[2], from: 'styles.css' });
}

for (const name of ['app.js', 'data.js', 'people.js', 'publication-renderer.js', 'scripts/serve.mjs', 'scripts/check.mjs', 'scripts/sync-publications.mjs']) {
  const result = spawnSync(process.execPath, ['--check', resolve(root, name)], { encoding: 'utf8' });
  if (result.status !== 0) fail(`${name}: JavaScript syntax error\n${result.stderr || result.error || ''}`);
}

function inspect(value, location, from, seen = new Set()) {
  if (value === null || typeof value === 'boolean') return;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) fail(`${from}: ${location}: use a finite number.`);
    return;
  }
  if (typeof value === 'string') {
    if (/^(?:https?:|mailto:|tel:|\/\/|assets\/|\.\.?\/)/i.test(value) ||
        /\.(?:url|href|src|avatar|photo|image|pdf|path)$/i.test(location) && value) {
      references.push({ value, from, label: `${from}: ${location}` });
    }
    return;
  }
  if (typeof value !== 'object') {
    fail(`${from}: ${location}: data should contain only JSON-compatible values.`);
    return;
  }
  if (seen.has(value)) {
    fail(`${from}: ${location}: circular reference in site data.`);
    return;
  }
  const nextSeen = new Set(seen).add(value);
  for (const [key, child] of Object.entries(value)) inspect(child, `${location}.${key}`, from, nextSeen);
}

function loadConfig(source, filename, property) {
  const sandbox = vm.createContext({ window: {} }, { codeGeneration: { strings: false, wasm: false } });
  vm.runInContext(source, sandbox, { filename, timeout: 1000 });
  const config = sandbox.window[property];
  if (!config || typeof config !== 'object' || Array.isArray(config)) throw new Error(`window.${property} must be an object.`);
  return config;
}

try {
  const data = loadConfig(dataSource, 'data.js', 'SITE_DATA');
  if (!data.profile || typeof data.profile !== 'object' || Array.isArray(data.profile)) throw new Error('SITE_DATA.profile must be an object.');
  if (!Array.isArray(data.publications)) throw new Error('SITE_DATA.publications must be an array.');
  if (!Array.isArray(data.services)) throw new Error('SITE_DATA.services must be an array.');
  inspect(data, 'SITE_DATA', 'data.js');
  JSON.parse(JSON.stringify(data));
} catch (error) {
  fail(`data.js: ${error.message}`);
}

try {
  const people = loadConfig(peopleSource, 'people.js', 'SITE_PEOPLE');
  inspect(people, 'SITE_PEOPLE', 'people.js');
  const names = new Map();
  function registerName(name, location) {
    const normalized = name.trim();
    if (!normalized) {
      fail(`people.js: ${location}: names and aliases must not be empty.`);
      return;
    }
    if (name !== normalized) fail(`people.js: ${location}: remove leading or trailing whitespace from names and aliases.`);
    if (names.has(normalized)) {
      fail(`people.js: ${location}: name or alias ${JSON.stringify(name)} conflicts with ${names.get(normalized)}.`);
    } else {
      names.set(normalized, location);
    }
  }
  for (const [name, person] of Object.entries(people)) {
    const location = `SITE_PEOPLE[${JSON.stringify(name)}]`;
    registerName(name, location);
    if (!person || typeof person !== 'object' || Array.isArray(person)) {
      fail(`people.js: ${location}: the person configuration must be an object.`);
      continue;
    }
    if (typeof person.url !== 'string') {
      fail(`people.js: ${location}.url: must be a string; use an empty string for plain text.`);
    } else if (person.url.trim() && !/^https?:\/\//i.test(person.url.trim())) {
      fail(`people.js: ${location}.url: use an HTTP or HTTPS URL, or an empty string for plain text.`);
    }
    if ('aliases' in person) {
      if (!Array.isArray(person.aliases) || person.aliases.some(alias => typeof alias !== 'string')) {
        fail(`people.js: ${location}.aliases: must be an array of strings when provided.`);
      } else {
        person.aliases.forEach((alias, index) => registerName(alias, `${location}.aliases[${index}]`));
      }
    }
  }
  JSON.parse(JSON.stringify(people));
} catch (error) {
  fail(`people.js: ${error.message}`);
}

try {
  const source = pages.find(page => page.filename === publicationPage)?.source;
  if (source !== syncPublicationsHtml(source, await renderPublications(root))) {
    fail(`${publicationPage}: generated publication markup is out of date. Run npm run sync, then npm run check.`);
  }
} catch (error) {
  fail(`Publication markup: ${error.message}`);
}

async function checkReference({ value, from, label = from }) {
  value = value.trim();
  if (!value || value === '#' || /^(?:data:|blob:)/i.test(value)) return;
  if (/^(?:https?:)?\/\//i.test(value)) {
    try {
      const url = new URL(value.startsWith('//') ? `https:${value}` : value);
      if (!url.hostname) throw new Error('missing host');
    } catch { fail(`${label}: invalid URL ${value}`); }
    return;
  }
  if (/^(?:mailto:|tel:)/i.test(value)) return;
  if (/^[a-z][a-z\d+.-]*:/i.test(value)) {
    fail(`${label}: unsupported link protocol ${value}`);
    return;
  }
  if (value.startsWith('/')) {
    fail(`${label}: use a relative path for GitHub project pages: ${value}`);
    return;
  }

  let filePart, fragment;
  try {
    const [pathAndQuery, ...hashParts] = value.split('#');
    filePart = decodeURIComponent(pathAndQuery.split('?')[0]);
    fragment = decodeURIComponent(hashParts.join('#'));
  } catch {
    fail(`${label}: invalid URL encoding ${value}`);
    return;
  }
  let filename = filePart ? resolve(root, dirname(from), filePart) : resolve(root, ['data.js', 'people.js'].includes(from) ? 'index.html' : from);
  if (filePart === '.' || filePart === '..' || filePart.endsWith('/')) filename = resolve(filename, 'index.html');
  const local = relative(root, filename);
  if (local.startsWith(`..${sep}`) || local === '..' || !staticFiles.has(local.split(sep)[0])) {
    fail(`${label}: link points outside the deployed site: ${value}`);
    return;
  }
  try {
    const target = await realpath(filename);
    if (!target.startsWith(root + sep) || !(await stat(target)).isFile()) throw new Error('not a site file');
    if (fragment && extname(filename) === '.html') {
      if (!documents.has(local)) parseHtml(await readFile(filename, 'utf8'), local);
      if (!documents.get(local).has(fragment)) fail(`${label}: missing anchor #${fragment} in ${local}`);
    }
  } catch {
    fail(`${label}: missing or unsafe local file ${value}`);
  }
}

// GitHub Pages artifacts must not contain symlinks; hidden files in assets are accidental uploads.
async function inspectAssets(directory) {
  try {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const filename = resolve(directory, entry.name);
      if (entry.isSymbolicLink() || entry.name.startsWith('.')) fail(`${relative(root, filename)}: remove hidden files or symlinks from public assets.`);
      else if (entry.isDirectory()) await inspectAssets(filename);
    }
  } catch (error) { fail(`assets: ${error.message}`); }
}

await inspectAssets(resolve(root, 'assets'));
for (const reference of references) await checkReference(reference);

if (errors.length) {
  console.error(`Site checks failed (${errors.length}):\n${errors.map(error => `- ${error}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Site checks passed: ${contentPages.length} content pages and ${redirectPages.length} redirect page, synchronized publication markup, static HTML anchors/references, content-page script order, JavaScript file syntax, site and people data, static JSON-LD, ${references.length} links/assets and deployment paths.`);
  console.log('The shared publication renderer is checked offline; browser DOM behavior and external URL availability are not checked.');
}
