const http = require('http');

const payload = JSON.stringify({
  grados: [5, 6],
  materias: ['ciencias'],
  plan: { test: true },
  estado: 'planificado'
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/docente/checkin',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Checkin HTTP Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', err => {
  console.error('Request error:', err.message);
});

req.write(payload);
req.end();
