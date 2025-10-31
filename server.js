const http = require('http');
const path = require('path');
const fs = require('fs');

const host = 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const rootDir = path.resolve(__dirname);

const mimeTypes = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'text/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
    const cleanUrl = req.url.split('?')[0].split('#')[0];
    const requested = cleanUrl === '/' ? '/index.html' : decodeURIComponent(cleanUrl);
    const resolvedPath = path.join(rootDir, requested);

    fs.stat(resolvedPath, (statErr, stats) => {
        if (!statErr && stats.isDirectory()) {
            return serveFile(path.join(resolvedPath, 'index.html'), res);
        }
        return serveFile(resolvedPath, res);
    });
});

server.listen(port, host, () => {
    console.log(`Servidor CAEDcj rodando em http://${host}:${port}`);
});

function serveFile(filePath, res) {
    fs.readFile(filePath, (readErr, data) => {
        if (readErr) {
            handleNotFound(res);
            return;
        }
        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

function handleNotFound(res) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.end('<h1>404 - Recurso não encontrado</h1>');
}
