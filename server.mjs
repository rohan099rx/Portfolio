import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url)).replace(/[\\/]$/, '');
const port = Number(process.env.PORT || 3000);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pdf': 'application/pdf',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

const server = createServer(async (req, res) => {
  const urlPath = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`).pathname;
  const requested = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
  const candidatePaths = [normalize(join(root, requested)), normalize(join(root, 'public', requested))]
    .filter((candidate) => candidate.startsWith(root + sep));
  try {
    let safePath;
    for (const candidate of candidatePaths) {
      try {
        const file = await stat(candidate);
        if (file.isFile()) { safePath = candidate; break; }
      } catch { /* Try the next mapped location. */ }
    }
    if (!safePath) throw new Error('Not a file');
    const body = await readFile(safePath);
    res.writeHead(200, { 'Content-Type': mime[extname(safePath)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(body);
  } catch {
    if (!extname(urlPath)) {
      const body = await readFile(join(root, 'index.html'));
      res.writeHead(200, { 'Content-Type': mime['.html'] }); res.end(body); return;
    }
    res.writeHead(404); res.end('Not found');
  }
});

server.listen(port, '0.0.0.0', () => console.log(`rohanml listening on 0.0.0.0:${port}`));
