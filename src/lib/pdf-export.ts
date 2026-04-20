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

import jsPDF from 'jspdf';
import { domToPng } from 'modern-screenshot';

/**
 * Exporta um elemento HTML específico para um arquivo PDF com múltiplas páginas se necessário.
 * Ideal para manter formatação de Markdown e KaTeX com precisão.
 * @param elementId ID do contêiner a ser exportado
 * @param filename Nome do arquivo PDF gerado
 */
export async function exportElementToPDF(elementId: string, filename: string = 'material.pdf'): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error('Elemento não encontrado na página.');
    }

    // Criamos um clone ou alteramos estilos críticos antes do snapshot
    // para garantir legibilidade no PDF (forçando fundo branco e texto legível)
    const originalStyle = {
        background: element.style.background,
        color: element.style.color,
    };

    try {
        const dataUrl = await domToPng(element, {
            quality: 0.95,
            backgroundColor: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#0a0a0b' : '#ffffff',
            scale: 2, // Higher quality for PDF
        });

        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 15; // 15mm nas bordas

        const imgProps = pdf.getImageProperties(dataUrl);
        const imgRatio = imgProps.width / imgProps.height;

        const targetWidth = pdfWidth - (margin * 2);
        const targetHeight = targetWidth / imgRatio;

        let heightLeft = targetHeight;
        let position = margin; // Top margin

        // Adiciona primeira página
        pdf.addImage(dataUrl, 'PNG', margin, position, targetWidth, targetHeight);
        heightLeft -= (pdfHeight - (margin * 2));

        // Adiciona páginas subsequentes
        while (heightLeft >= 0) {
            position = heightLeft - targetHeight + margin; // Desloca para cima
            pdf.addPage();
            pdf.addImage(dataUrl, 'PNG', margin, position, targetWidth, targetHeight);
            heightLeft -= (pdfHeight - (margin * 2));
        }

        // Salva arquivo
        pdf.save(filename);
    } catch (error) {
        console.error('Falha ao gerar snapshot PDF:', error);
        throw new Error('Falha ao processar exportação PDF.');
    } finally {
        // Redefine estilos caso tenham sido modificados
        element.style.background = originalStyle.background;
        element.style.color = originalStyle.color;
    }
}
