import { createServer, ServerResponse } from 'http';
import { readFile } from 'fs/promises';
import { extname, join, normalize } from 'path';

const mimeTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

async function serveFile(pathname: string, response: ServerResponse): Promise<void> {
  const requested = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const safePath = normalize(requested).replace(/^(\.\.(\\|\/|$))+/, '');

  try {
    const file = await readFile(join(__dirname, '..', 'src', 'public', safePath));
    response.writeHead(200, { 'Content-Type': mimeTypes[extname(safePath)] ?? 'application/octet-stream' });
    response.end(file);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
}

const server = createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
  void serveFile(url.pathname, response);
});

const port = Number(process.env.PORT ?? 4173);
server.listen(port, () => console.log(`TIMO running at http://localhost:${port}`));
