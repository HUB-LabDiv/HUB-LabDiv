/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

// scripts/cleanup-artifacts.js
const fs = require('fs');
const path = require('path');

const pathsToRemove = [
    './artifacts',
    './remediation_plan.md',
    './implementation_plan.md',
    './todo.txt',
    './temp_sql_backups'
];

console.log('🚀 Iniciando Purga Técnica de Artefactos...');

pathsToRemove.forEach((p) => {
    const fullPath = path.resolve(p);
    if (fs.existsSync(fullPath)) {
        if (fs.lstatSync(fullPath).isDirectory()) {
            fs.rmSync(fullPath, { recursive: true, force: true });
        } else {
            fs.unlinkSync(fullPath);
        }
        console.log(`✅ Removido: ${p}`);
    }
});

console.log('✨ Limpeza concluída. Código pronto para Produção.');
