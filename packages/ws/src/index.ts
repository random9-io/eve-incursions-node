import { WebSocketServer, WebSocket } from 'ws';
import type { IncomingMessage } from 'http';
import Redis from 'ioredis';

const MAX_CONNECTIONS = 500;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const wss = new WebSocketServer({
  port: 4003,
  verifyClient: (info: { origin: string; req: IncomingMessage }, cb: (result: boolean, code?: number, reason?: string) => void) => {
    if (wss.clients.size >= MAX_CONNECTIONS) {
      cb(false, 503, 'Too many connections');
      return;
    }

    if (ALLOWED_ORIGINS.length > 0 && !ALLOWED_ORIGINS.includes(info.origin)) {
      cb(false, 403, 'Origin not allowed');
      return;
    }

    cb(true);
  }
});

const redis = new Redis({
  host: 'redis',
  password: process.env.REDIS_PASSWORD || undefined,
});

const PING_INTERVAL = 30_000;
const pingInterval = setInterval(() => {
  for (const client of wss.clients) {
    if ((client as any).__alive === false) {
      client.terminate();
      continue;
    }
    (client as any).__alive = false;
    client.ping();
  }
}, PING_INTERVAL);

wss.on('connection', (ws: WebSocket) => {
  (ws as any).__alive = true;
  ws.on('pong', () => { (ws as any).__alive = true; });
});

wss.on('close', () => clearInterval(pingInterval));

redis.subscribe('spawn.change').then(() => {
  redis.on('message', async (channel) => {
    if (channel !== 'spawn.change') return;

    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send('spawn.change');
      }
    }
  });
});
