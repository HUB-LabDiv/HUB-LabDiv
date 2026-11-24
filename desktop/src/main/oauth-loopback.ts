/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 *
 * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import http from 'node:http';
import type { AddressInfo } from 'node:net';
import type { OAuthLoopbackCallbackPayload } from '../types/hub-desktop';

const SUCCESS_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Login Concluído — HUB LabDiv</title>
  <style>
    :root {
      color-scheme: light dark;
      --bg: #f8fafc;
      --surface: #ffffff;
      --text: #0f172a;
      --muted: #475569;
      --border: #e2e8f0;
      --accent: #1F9FCF;
      --navy: #0F4780;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #121212;
        --surface: #1e1e1e;
        --text: #f8fafc;
        --muted: #94a3b8;
        --border: rgba(255,255,255,0.12);
      }
    }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg);
      color: var(--text);
      font-family: 'Open Sans', system-ui, -apple-system, sans-serif;
      padding: 20px;
    }
    .card {
      max-width: 420px;
      width: 100%;
      padding: 28px;
      border-radius: 24px;
      background: var(--surface);
      border: 1px solid var(--border);
      text-align: center;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(31, 159, 207, 0.15);
      color: var(--accent);
      font-weight: 800;
      font-size: 12px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    h1 { font-size: 1.25rem; margin: 0 0 8px; }
    p { font-size: 0.92rem; color: var(--muted); line-height: 1.5; margin: 0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">HUB LabDiv • IFUSP</div>
    <h1>Autenticação concluída</h1>
    <p>Você já pode fechar esta aba e retornar ao aplicativo HUB LabDiv Desktop.</p>
  </div>
</body>
</html>`;

export class OAuthLoopbackServer {
  private server: http.Server | null = null;
  private timeoutTimer: NodeJS.Timeout | null = null;

  async start(
    onCallback: (payload: OAuthLoopbackCallbackPayload) => void,
    timeoutMs = 5 * 60_000
  ): Promise<{ callbackUrl: string }> {
    // Garante encerramento de qualquer servidor loopback anterior antes de abrir um novo
    await this.stop();

    const server = http.createServer((req, res) => {
      try {
        const reqUrl = new URL(req.url || '/', 'http://127.0.0.1');
        if (req.method !== 'GET' || reqUrl.pathname !== '/auth/callback') {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Not found');
          return;
        }

        const code = reqUrl.searchParams.get('code') || undefined;
        const error = reqUrl.searchParams.get('error') || undefined;
        const errorDescription = reqUrl.searchParams.get('error_description') || undefined;

        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
        });
        res.end(SUCCESS_HTML, () => {
          setImmediate(() => {
            void this.stop();
          });
        });

        onCallback({
          code,
          error,
          errorDescription,
          rawQuery: reqUrl.search,
        });
      } catch {
        res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Invalid callback');
      }
    });

    this.server = server;

    await new Promise<void>((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', () => {
        server.removeListener('error', reject);
        resolve();
      });
    });

    const address = server.address() as AddressInfo | null;
    if (!address || typeof address.port !== 'number') {
      await this.stop();
      throw new Error('Falha ao alocar porta loopback para autenticação OAuth.');
    }

    this.timeoutTimer = setTimeout(() => {
      void this.stop();
    }, timeoutMs);
    this.timeoutTimer.unref?.();

    return {
      callbackUrl: `http://127.0.0.1:${address.port}/auth/callback`,
    };
  }

  async stop(): Promise<void> {
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
    const srv = this.server;
    this.server = null;
    if (!srv) return;
    await new Promise<void>((resolve) => {
      try {
        srv.closeAllConnections?.();
        srv.close(() => resolve());
      } catch {
        resolve();
      }
    });
  }
}
