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

/**
 * Utilitário de alinhamento por linha para blocos de texto.
 *
 * Formato: linhas que começam com `{align:center}`, `{align:right}` ou
 * `{align:justify}` recebem o alinhamento indicado. Linhas sem marcador
 * são tratadas como `left` (padrão).
 *
 * Os marcadores são removidos antes da renderização Markdown, garantindo
 * que a sintaxe Markdown (como `# Título`) continue funcionando
 * normalmente.
 */

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

/** Segmento contíguo de linhas com o mesmo alinhamento. */
export interface AlignedSegment {
    text: string;
    align: TextAlign;
}

const ALIGN_REGEX = /^\{align:(left|center|right|justify)\}/;

/* ─── Funções de parsing ──────────────────────────────────────────────── */

/**
 * Extrai o alinhamento e o texto limpo de uma única linha.
 */
export function stripAlignmentMarker(line: string): { text: string; align: TextAlign } {
    const match = line.match(ALIGN_REGEX);
    if (match) {
        return { text: line.slice(match[0].length), align: match[1] as TextAlign };
    }
    return { text: line, align: 'left' };
}

/**
 * Agrupa o texto bruto em segmentos contíguos de mesmo alinhamento.
 * Cada segmento já contém o texto limpo (sem marcadores).
 */
export function processAlignedText(rawText: string): AlignedSegment[] {
    if (!rawText) return [{ text: '', align: 'left' }];

    const lines = rawText.split('\n');
    const segments: AlignedSegment[] = [];
    let currentAlign: TextAlign = 'left';
    let currentLines: string[] = [];

    for (const line of lines) {
        const { text, align } = stripAlignmentMarker(line);

        if (align !== currentAlign && currentLines.length > 0) {
            segments.push({ text: currentLines.join('\n'), align: currentAlign });
            currentLines = [];
        }
        currentAlign = align;
        currentLines.push(text);
    }

    if (currentLines.length > 0) {
        segments.push({ text: currentLines.join('\n'), align: currentAlign });
    }

    return segments;
}

/**
 * Remove todos os marcadores de alinhamento do texto, retornando Markdown puro.
 */
export function stripAllAlignmentMarkers(rawText: string): string {
    return rawText
        .split('\n')
        .map((line) => stripAlignmentMarker(line).text)
        .join('\n');
}

/* ─── Funções de cursor (editor) ──────────────────────────────────────── */

/**
 * Detecta o alinhamento da linha onde o cursor está posicionado.
 */
export function getLineAlignmentAtCursor(text: string, cursorPosition: number): TextAlign {
    const beforeCursor = text.substring(0, cursorPosition);
    const lineStart = beforeCursor.lastIndexOf('\n') + 1;
    const lineEnd = text.indexOf('\n', cursorPosition);
    const currentLine = text.substring(lineStart, lineEnd === -1 ? text.length : lineEnd);

    const match = currentLine.match(ALIGN_REGEX);
    return match ? (match[1] as TextAlign) : 'left';
}

/**
 * Define o alinhamento de uma única linha com base na posição do cursor.
 * Retorna o texto atualizado e a nova posição do cursor ajustada.
 */
export function setLineAlignmentAtCursor(
    text: string,
    cursorPosition: number,
    align: TextAlign,
): { text: string; newCursorPosition: number } {
    const beforeCursor = text.substring(0, cursorPosition);
    const lineStart = beforeCursor.lastIndexOf('\n') + 1;
    const lineEnd = text.indexOf('\n', cursorPosition);
    const currentLine = text.substring(lineStart, lineEnd === -1 ? text.length : lineEnd);

    // Remove marcador existente
    const existingMatch = currentLine.match(ALIGN_REGEX);
    const stripped = existingMatch ? currentLine.slice(existingMatch[0].length) : currentLine;

    // left = sem marcador (padrão)
    const newLine = align === 'left' ? stripped : `{align:${align}}${stripped}`;

    const newText =
        text.substring(0, lineStart) +
        newLine +
        text.substring(lineEnd === -1 ? text.length : lineEnd);

    // Ajusta posição do cursor para manter coerência
    const oldMarkerLength = existingMatch ? existingMatch[0].length : 0;
    const newMarkerLength = align === 'left' ? 0 : `{align:${align}}`.length;
    const cursorDelta = newMarkerLength - oldMarkerLength;

    return {
        text: newText,
        newCursorPosition: Math.max(lineStart + newMarkerLength, cursorPosition + cursorDelta),
    };
}
