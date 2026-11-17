// Este programa é um software livre (Licença AGPLv3)
// ARQUIVO: src/lib/auth/sso-ticket.ts
import crypto from 'node:crypto';

export interface HubSsoPayload {
  hubUserId: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl?: string | null;
  isLabdiv: boolean;
  organizations: string[];
  role: string;
  iat: number;
  exp: number;
  nonce: string;
}

/**
 * Assina um ticket de Single Sign-On (SSO) do HUB para o Aurtistic com HMAC-SHA256.
 */
export function signHubSsoTicket(
  data: Omit<HubSsoPayload, 'iat' | 'exp' | 'nonce'>,
  secret: string,
  expiresInSeconds: number = 300
): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: HubSsoPayload = {
    ...data,
    iat: now,
    exp: now + expiresInSeconds,
    nonce: crypto.randomBytes(12).toString('hex'),
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');

  return `${payloadB64}.${signature}`;
}

