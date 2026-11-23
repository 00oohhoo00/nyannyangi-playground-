import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const isProduction = process.env.NODE_ENV === 'production';
  const PORT =
    !isProduction && process.env.PORT === '8080' && process.env.NGINX_PORT === '8080'
      ? Number(process.env.DEFAULT_APP_PORT) || 3000
      : Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.text({ limit: '10mb' }));

  // ─────────────────────────────────────────────────────────────
  // Google Apps Script Universal Server Proxy
  // Bypasses browser 302 redirect CORS restrictions effortlessly.
  // ─────────────────────────────────────────────────────────────
  app.all('/api/gas-proxy', async (req: Request, res: Response) => {
    try {
      let targetUrl = (req.query.targetUrl as string) || '';
      let method = req.method;
      let bodyData: any = undefined;

      if (req.method === 'POST') {
        if (typeof req.body === 'object' && req.body && req.body.targetUrl) {
          targetUrl = req.body.targetUrl;
          method = req.body.method || 'POST';
          bodyData = req.body.payload;
        } else {
          bodyData = req.body;
        }
      }

      if (!targetUrl) {
        return res.status(400).json({
          success: false,
          error: 'targetUrl 매개변수가 필요합니다 (예: https://script.google.com/macros/s/.../exec)',
        });
      }

      const cleanUrl = targetUrl.trim();
      const fetchOptions: RequestInit = {
        method: method || 'GET',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        redirect: 'follow',
      };

      if (method === 'POST' && bodyData !== undefined) {
        fetchOptions.body = typeof bodyData === 'string' ? bodyData : JSON.stringify(bodyData);
      }

      console.log(`[GAS Proxy] Forwarding ${method} -> ${cleanUrl}`);
      const gasResponse = await fetch(cleanUrl, fetchOptions);
      const responseText = await gasResponse.text();

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      try {
        const json = JSON.parse(responseText);
        return res.status(gasResponse.status).json(json);
      } catch {
        res.setHeader('Content-Type', 'text/plain;charset=utf-8');
        return res.status(gasResponse.status).send(responseText);
      }
    } catch (err: any) {
      console.error('[GAS Proxy Error]', err);
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(502).json({
        success: false,
        error: 'Google Apps Script 서버 통신 오류: ' + (err?.message || String(err)),
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, server: 'Nyang Playground Express + GAS Proxy' });
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🐾 Nyang Playground server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
