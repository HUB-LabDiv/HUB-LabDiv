import fs from 'fs';
import path from 'path';

const LICENSE_TEXT = `/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 * * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */`;

const extensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css', '.sql'];
const ignoreDirs = ['node_modules', '.next', 'dist', 'build', '.git', '.gemini', 'public'];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('Licença Pública Geral Affero GNU') || content.includes('AGPLv3')) {
        return;
    }
    
    const lines = content.split('\n');
    let insertIndex = 0;
    let foundDirective = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.match(/^['"]use (client|server)['"];?$/)) {
            insertIndex = i + 1;
            foundDirective = true;
        } else if (line !== '' && !line.startsWith('//') && !line.startsWith('/*') && !line.startsWith('*')) {
            if (!foundDirective) {
                insertIndex = 0;
            }
            break;
        }
    }
    
    // Add empty line padding if inserting after directives
    const injection = (insertIndex > 0 ? '\n' : '') + LICENSE_TEXT + '\n';
    
    lines.splice(insertIndex, 0, injection);
    
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    console.log(`Applied to: ${filePath}`);
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!ignoreDirs.includes(file)) {
                walkDir(fullPath);
            }
        } else {
            const ext = path.extname(fullPath);
            if (extensions.includes(ext)) {
                processFile(fullPath);
            }
        }
    }
}

const rootDir = process.cwd();
console.log(`Starting license application in: ${rootDir}`);
walkDir(rootDir);
console.log('Finished applying license headers.');
