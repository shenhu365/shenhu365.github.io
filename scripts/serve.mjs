import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = await realpath(resolve(dirname(fileURLToPath(import.meta.url)), '..'));
const args = process.argv.slice(2);
const options = { port: process.env.PORT || '4173', base: '/' };

for (let i = 0; i < args.length; i++) {
  const name = args[i];
  if (!['--port', '--base'].includes(name) || !args[i + 1]) {
    console.error('Usage: npm run dev -- [--port 4173] [--base /repository-name/]');
    process.exit(1);
  }
  options[name.slice(2)] = args[++i];
}

const port = Number(options.port);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('Port must be an integer between 1 and 65535.');
  process.exit(1);
}
if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(options.base)) {
  console.error('Base must start and end with /, for example /scholarpage/.');
  process.exit(1);
}

const base = options.base;
const allowed = new Set(['index.html', 'publications.html', 'styles.css', 'app.js', 'data.js', 'assets']);
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.gif': 'image/gif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.bib': 'text/plain; charset=utf-8'
};

function reply(res, status, message, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', ...headers });
  res.end(message);
}

const server = createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    reply(res, 405, 'Method not allowed', { Allow: 'GET, HEAD' });
    return;
  }

  let requestPath;
  try {
    requestPath = decodeURIComponent((req.url || '/').split('?')[0]);
  } catch {
    reply(res, 400, 'Invalid URL');
    return;
  }

  // Inspect the original decoded path before a URL parser can normalize ../ away.
  if (!requestPath.startsWith('/') || requestPath.includes('\\') ||
      requestPath.includes('\0') || requestPath.split('/').some(part => part.startsWith('.'))) {
    reply(res, 403, 'Forbidden');
    return;
  }

  if (base !== '/' && requestPath === base.slice(0, -1)) {
    res.writeHead(308, { Location: base });
    res.end();
    return;
  }
  if (!requestPath.startsWith(base)) {
    reply(res, 404, `Not found. This preview is mounted at ${base}`);
    return;
  }

  const relativePath = requestPath.slice(base.length) || 'index.html';
  if (!allowed.has(relativePath.split('/')[0])) {
    reply(res, 404, 'Not found');
    return;
  }

  try {
    const absolutePath = await realpath(resolve(root, relativePath));
    if (!absolutePath.startsWith(root + sep) ||
        absolutePath.slice(root.length + 1).split(sep).some(part => part.startsWith('.'))) {
      reply(res, 403, 'Forbidden');
      return;
    }
    const info = await stat(absolutePath);
    if (!info.isFile()) {
      reply(res, 404, 'Not found');
      return;
    }

    res.writeHead(200, {
      'Content-Type': mimeTypes[extname(absolutePath).toLowerCase()] || 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    });
    if (req.method === 'HEAD') res.end();
    else createReadStream(absolutePath).on('error', () => res.destroy()).pipe(res);
  } catch (error) {
    reply(res, error.code === 'ENOENT' || error.code === 'ENOTDIR' ? 404 : 500,
      error.code === 'ENOENT' || error.code === 'ENOTDIR' ? 'Not found' : 'Unable to read file');
  }
});

server.on('error', error => {
  console.error(`Preview could not start: ${error.message}`);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log(`Academic homepage: http://127.0.0.1:${port}${base}`);
  console.log('Press Ctrl+C to stop.');
});
