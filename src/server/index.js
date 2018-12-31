const app = require('http').createServer(handler);
const io = require('socket.io').listen(app);
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;

function tick(){
  const now = new Date().toUTCString();
  io.sockets.send(now);
}

function handler(req, res) {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(html, 'utf-8'));
  res.end(html);
}

setInterval(tick, 1000);


app.listen(port);

console.log('Started listening to %s', port);
