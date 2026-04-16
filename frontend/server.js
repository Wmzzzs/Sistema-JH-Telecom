const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

// Tipos MIME comuns
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Resolver caminho do arquivo
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

  // Validar caminho (prevenir directory traversal)
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Access denied');
    return;
  }

  // Ler arquivo
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Se não encontrar, tentar index.html
      fs.readFile(path.join(__dirname, 'index.html'), (err2, data2) => {
        if (err2) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<h1>404 - Arquivo não encontrado</h1>');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data2);
        }
      });
      return;
    }

    // Detectar tipo MIME
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n✅ Frontend rodando em http://localhost:${PORT}\n`);
  console.log(`📂 Servindo arquivos de: ${__dirname}\n`);
});
