import { readFile, realpath, stat, readdir } from 'node:fs/promises';
import { dirname, extname, relative, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = await realpath(resolve(dirname(fileURLToPath(import.meta.url)), '..'));
const errors = [];
const documents = new Map();
const references = [];
const staticFiles = new Set(['index.html', 'styles.css', 'app.js', 'data.js', 'assets', '.nojekyll']);
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
  for (const match of source.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(match[1]); } catch (error) { fail(`${filename}: invalid JSON-LD: ${error.message}`); }
  }
}

const html = await read('index.html');
const css = await read('styles.css');
const dataSource = await read('data.js');
await read('.nojekyll');
parseHtml(html, 'index.html');

for (const match of css.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gi)) {
  if (!match[2].startsWith('#')) references.push({ value: match[2], from: 'styles.css' });
}

for (const name of ['app.js', 'data.js', 'scripts/serve.mjs', 'scripts/check.mjs']) {
  const result = spawnSync(process.execPath, ['--check', resolve(root, name)], { encoding: 'utf8' });
  if (result.status !== 0) fail(`${name}: JavaScript syntax error\n${result.stderr || result.error || ''}`);
}

try {
  const sandbox = vm.createContext({ window: {} }, { codeGeneration: { strings: false, wasm: false } });
  vm.runInContext(dataSource, sandbox, { filename: 'data.js', timeout: 1000 });
  const data = sandbox.window.SITE_DATA;
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('window.SITE_DATA must be an object.');
  if (!data.profile || typeof data.profile !== 'object' || Array.isArray(data.profile)) throw new Error('SITE_DATA.profile must be an object.');
  if (!Array.isArray(data.publications)) throw new Error('SITE_DATA.publications must be an array.');

  function inspect(value, location, seen = new Set()) {
    if (value === null || typeof value === 'boolean') return;
    if (typeof value === 'number') {
      if (!Number.isFinite(value)) fail(`${location}: use a finite number.`);
      return;
    }
    if (typeof value === 'string') {
      if (/^(?:https?:|mailto:|tel:|\/\/|assets\/|\.\.?\/)/i.test(value) ||
          /\.(?:url|href|src|avatar|photo|image|pdf|path)$/i.test(location) && value) {
        references.push({ value, from: 'data.js', label: location });
      }
      return;
    }
    if (typeof value !== 'object') {
      fail(`${location}: data should contain only JSON-compatible values.`);
      return;
    }
    if (seen.has(value)) {
      fail(`${location}: circular reference in site data.`);
      return;
    }
    const nextSeen = new Set(seen).add(value);
    for (const [key, child] of Object.entries(value)) inspect(child, `${location}.${key}`, nextSeen);
  }
  inspect(data, 'SITE_DATA');
  JSON.parse(JSON.stringify(data));
} catch (error) {
  fail(`data.js: ${error.message}`);
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
  const filename = filePart ? resolve(root, dirname(from), filePart) : resolve(root, from === 'data.js' ? 'index.html' : from);
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
  console.log(`Site checks passed: JavaScript syntax, site data, JSON-LD, ${references.length} links/assets and deployment paths.`);
  console.log('External URL availability is not checked; this check runs entirely offline.');
}
