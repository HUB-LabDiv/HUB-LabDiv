#!/usr/bin/env node
/**
 * Script que injeta um BUILD_ID único no service worker a cada build.
 * Isso garante que o cache antigo seja limpo automaticamente no deploy.
 * 
 * Hub de Comunicação Científica Lab-Div V3.0
 * Software livre sob AGPLv3.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const swPath = join(__dirname, '../public/sw.js');

const buildId = Date.now().toString();
let content = readFileSync(swPath, 'utf8');
content = content.replace(/const BUILD_ID = '[^']*';/, `const BUILD_ID = '${buildId}';`);
writeFileSync(swPath, content, 'utf8');

console.log(`✅ [SW] BUILD_ID atualizado para: ${buildId}`);
