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

import 'server-only';
import { z } from 'zod';
import type { DesktopReleaseAsset, DesktopReleasePayload } from '@/types/desktop';

const DEFAULT_GITHUB_REPO = 'HUB-LabDiv/HUB-LabDiv';

const GithubAssetSchema = z.object({
  name: z.string(),
  browser_download_url: z.string().url(),
  size: z.number().nonnegative().optional().default(0),
});

const GithubReleaseSchema = z.object({
  tag_name: z.string().optional().default(''),
  name: z.string().nullable().optional(),
  draft: z.boolean().optional().default(false),
  prerelease: z.boolean().optional().default(false),
  published_at: z.string().nullable().optional(),
  html_url: z.string().url().optional(),
  assets: z.array(GithubAssetSchema).optional().default([]),
});

const GithubReleasesListSchema = z.array(GithubReleaseSchema);

type GithubAssetParsed = z.infer<typeof GithubAssetSchema>;

function pickAsset(
  assets: GithubAssetParsed[],
  matcher: (lowercaseName: string) => boolean
): DesktopReleaseAsset | null {
  const found = assets.find((a) => matcher(a.name.toLowerCase()));
  if (!found) return null;
  return {
    url: found.browser_download_url,
    filename: found.name,
    sizeBytes: Number(found.size) || 0,
  };
}

export async function getLatestDesktopRelease(): Promise<DesktopReleasePayload> {
  const repo = String(process.env.GITHUB_RELEASES_REPO || DEFAULT_GITHUB_REPO).trim();
  const token = String(
    process.env.GITHUB_RELEASE_TOKEN || process.env.GITHUB_TOKEN || ''
  ).trim();
  const msStoreUrl = String(process.env.NEXT_PUBLIC_MS_STORE_URL || '').trim() || null;

  const owner = repo.split('/')[0] || 'HUB-LabDiv';
  const repoName = repo.split('/')[1] || 'HUB-LabDiv';
  const releasePageUrl = `https://github.com/${repo}/releases`;
  const aptRepoUrl = `https://${owner.toLowerCase()}.github.io/${repoName}/apt`;
  const aptInstallCommand = `curl -fsSL ${aptRepoUrl}/install.sh | sudo bash`;
  const aptManualCommand = `curl -fsSL ${aptRepoUrl}/KEY.gpg | sudo gpg --yes --dearmor -o /usr/share/keyrings/hub-labdiv.gpg && echo "deb [signed-by=/usr/share/keyrings/hub-labdiv.gpg] ${aptRepoUrl} ./" | sudo tee /etc/apt/sources.list.d/hub-labdiv.list && sudo apt update && sudo apt install -y hub-labdiv`;

  const fallback: DesktopReleasePayload = {
    available: false,
    version: 'desktop-v1.0.0',
    publishedAt: null,
    releasePageUrl,
    msStoreUrl,
    aptInstallCommand,
    aptManualCommand,
    assets: {
      windowsExe: null,
      linuxDeb: null,
      linuxAppImage: null,
      macDmg: null,
    },
  };

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'HUB-LabDiv-Web-Release-Client/1.0',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const resp = await fetch(
      `https://api.github.com/repos/${repo}/releases?per_page=10`,
      {
        headers,
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(4500),
      }
    );

    if (!resp.ok) {
      return fallback;
    }

    const rawJson: unknown = await resp.json();
    const parsed = GithubReleasesListSchema.safeParse(rawJson);
    if (!parsed.success) {
      return fallback;
    }

    const desktopRelease = parsed.data.find(
      (r) => !r.draft && !r.prerelease && r.tag_name.toLowerCase().startsWith('desktop-v')
    );

    if (!desktopRelease) {
      return fallback;
    }

    const assets = desktopRelease.assets;
    return {
      available: assets.length > 0,
      version: desktopRelease.tag_name || desktopRelease.name || 'desktop-v1.0.0',
      publishedAt: desktopRelease.published_at || null,
      releasePageUrl: desktopRelease.html_url || releasePageUrl,
      msStoreUrl,
      aptInstallCommand,
      aptManualCommand,
      assets: {
        windowsExe: pickAsset(assets, (n) => n.endsWith('.exe')),
        linuxDeb: pickAsset(assets, (n) => n.endsWith('.deb')),
        linuxAppImage: pickAsset(assets, (n) => n.endsWith('.appimage')),
        macDmg: pickAsset(assets, (n) => n.endsWith('.dmg')),
      },
    };
  } catch {
    return fallback;
  }
}
