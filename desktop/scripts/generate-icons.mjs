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

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const desktopRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(desktopRoot, '..');
const buildDir = path.join(desktopRoot, 'build');
const appxDir = path.join(buildDir, 'appx');

const sourceCandidates = [
  path.join(repoRoot, 'resources', 'icon.png'),
  path.join(repoRoot, 'public', 'icone-HUBLabDiv-bgscience.png'),
  path.join(repoRoot, 'public', 'icone-HUBLabDiv-transparent.png'),
];

const sourcePath = sourceCandidates.find((p) => fs.existsSync(p));
if (!sourcePath) {
  throw new Error('Nenhum ícone fonte encontrado em resources/icon.png ou public/.');
}

fs.mkdirSync(buildDir, { recursive: true });
fs.mkdirSync(appxDir, { recursive: true });

async function generate() {
  // 1. Ícone principal 512x512 (Linux / macOS / janela Electron)
  await sharp(sourcePath)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(buildDir, 'icon.png'));

  // 2. Ícone Windows .ico multi-resolução (16, 32, 48, 64, 128, 256)
  const icoSizes = [16, 32, 48, 64, 128, 256];
  const icoBuffers = await Promise.all(
    icoSizes.map((size) =>
      sharp(sourcePath)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer()
    )
  );
  const icoBuffer = await pngToIco(icoBuffers);
  fs.writeFileSync(path.join(buildDir, 'icon.ico'), icoBuffer);

  // 3. Ícones da bandeja (Linux 32x32 colorido + macOS template 16x16 / 32x32)
  await sharp(sourcePath)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(buildDir, 'tray.png'));

  const makeMacTemplate = async (size, dest) => {
    const { data, info } = await sharp(sourcePath)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Converte pixels visíveis para preto sólido preservando o canal alpha (Template Image macOS)
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
      }
    }

    await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
      .png()
      .toFile(dest);
  };

  await makeMacTemplate(16, path.join(buildDir, 'trayTemplate.png'));
  await makeMacTemplate(32, path.join(buildDir, 'trayTemplate@2x.png'));

  // 4. Assets Microsoft Store (.appx)
  const appxSquareSizes = [
    ['Square44x44Logo.png', 44],
    ['Square150x150Logo.png', 150],
    ['StoreLogo.png', 50],
  ];

  for (const [filename, size] of appxSquareSizes) {
    await sharp(sourcePath)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(appxDir, filename));
  }

  // Wide310x150Logo.png: centraliza o ícone com padding sem distorcer/esticar
  const wideIconBuf = await sharp(sourcePath)
    .resize(110, 110, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 310,
      height: 150,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: wideIconBuf, gravity: 'center' }])
    .png()
    .toFile(path.join(appxDir, 'Wide310x150Logo.png'));

  console.log(`[icons] Ícones gerados com sucesso a partir de ${path.relative(repoRoot, sourcePath)}`);
}

await generate();
