import { readFile, realpath, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

export const publicationPage = 'publications/index.html';

function loadConfig(source, filename, property) {
  const sandbox = vm.createContext({ window: {} }, { codeGeneration: { strings: false, wasm: false } });
  vm.runInContext(source, sandbox, { filename, timeout: 1000 });
  const config = sandbox.window[property];
  if (!config || typeof config !== 'object' || Array.isArray(config)) throw new Error(`${filename}: window.${property} must be an object.`);
  return config;
}

export async function renderPublications(root) {
  const [dataSource, peopleSource, rendererSource] = await Promise.all(
    ['data.js', 'people.js', 'publication-renderer.js'].map(filename => readFile(resolve(root, filename), 'utf8'))
  );
  // Keep the two configuration files independent, as they are in the offline check.
  const data = loadConfig(dataSource, 'data.js', 'SITE_DATA');
  const people = loadConfig(peopleSource, 'people.js', 'SITE_PEOPLE');
  const sandbox = vm.createContext({ window: {}, URL, data, people }, { codeGeneration: { strings: false, wasm: false } });
  vm.runInContext(rendererSource, sandbox, { filename: 'publication-renderer.js', timeout: 1000 });
  return vm.runInContext("window.SITE_PUBLICATIONS.render(data, people, '../')", sandbox, { timeout: 1000 });
}

export function syncPublicationsHtml(source, markup) {
  for (const [name, content] of [['publication-years', markup.years], ['publication-list', markup.list]]) {
    const start = `<!-- ${name}:start -->`;
    const end = `<!-- ${name}:end -->`;
    const startIndex = source.indexOf(start);
    const endIndex = source.indexOf(end);
    if (startIndex < 0 || endIndex < startIndex || source.indexOf(start, startIndex + start.length) !== -1 ||
        source.indexOf(end, endIndex + end.length) !== -1) {
      throw new Error(`${publicationPage}: expected one ordered pair of ${name} start/end markers.`);
    }
    const indentation = source.slice(source.lastIndexOf('\n', startIndex) + 1, startIndex).match(/^[ \t]*/)[0];
    const generated = content ? `\n${content.split('\n').map(line => indentation + line).join('\n')}\n${indentation}` : `\n${indentation}`;
    source = source.slice(0, startIndex + start.length) + generated + source.slice(endIndex);
  }
  return source;
}

async function main() {
  const root = await realpath(resolve(dirname(fileURLToPath(import.meta.url)), '..'));
  const filename = resolve(root, publicationPage);
  const source = await readFile(filename, 'utf8');
  const updated = syncPublicationsHtml(source, await renderPublications(root));
  if (source === updated) console.log(`${publicationPage}: publication markup is already up to date.`);
  else {
    await writeFile(filename, updated);
    console.log(`${publicationPage}: synchronized publication years and list from data.js / people.js.`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error(`Publication sync failed: ${error.message}`);
    process.exitCode = 1;
  });
}
