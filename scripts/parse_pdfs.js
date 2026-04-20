/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 * * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

const fs = require('fs');
const PDFParser = require('pdf2json');

async function extractTextFromPDF(pdfPath) {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(this, 1);

        pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", pdfData => {
            const rawText = pdfParser.getRawTextContent();
            resolve(rawText);
        });

        pdfParser.loadPDF(pdfPath);
    });
}

async function main() {
    const files = [
        'public/Jupiterweb-bach.pdf',
        'public/Jupiterweb-lic.pdf',
        'public/Jupiterweb-med.pdf'
    ];

    for (const file of files) {
        console.log(`\n\n=== Extracting ${file} ===`);
        try {
            const text = await extractTextFromPDF(file);
            const outPath = file.replace('.pdf', '.txt');
            fs.writeFileSync(outPath, text);
            console.log(`Saved text to ${outPath}. Preview:`);
            console.log(text.substring(0, 1000));
        } catch (err) {
            console.error("Failed to parse", file, err);
        }
    }
}

main();
