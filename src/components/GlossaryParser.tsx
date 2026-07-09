'use client';

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


import React, { useEffect } from 'react';
import { useGlossaryStore } from '@/store/useGlossaryStore';

interface GlossaryParserProps {
    text: string;
    userLanguage?: string;
}

export function GlossaryParser({ text, userLanguage = 'jovem' }: GlossaryParserProps) {
    const { glossary, fetchGlossary } = useGlossaryStore();

    useEffect(() => {
        fetchGlossary();
    }, [fetchGlossary]);

    if (!text || !glossary.length) {
        return <span className="whitespace-pre-wrap">{text}</span>;
    }

    // Ordenar do maior termo para o menor, para evitar que "Buraco" quebre "Buraco Negro"
    const sortedWords = [...glossary].sort((a, b) => b.termo.length - a.termo.length);

    // Precisamos de uma lógica que não quebre tags HTML se houver.
    // Como aqui recebemos texto puro e não parseamos Markdown por enquanto, podemos fazer um replace simples.
    // Vamos fazer um regex grandão com todas as palavras.
    
    // Escapar caracteres especiais de regex nos termos
    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    const pattern = new RegExp(`\\b(${sortedWords.map(w => escapeRegExp(w.termo)).join('|')})\\b`, 'gi');

    const parts = text.split(pattern);

    return (
        <span className="whitespace-pre-wrap leading-relaxed">
            {parts.map((part, i) => {
                // Find se a parte é uma palavra do glossário (case insensitive)
                const wordObj = sortedWords.find(w => w.termo.toLowerCase() === part.toLowerCase());
                
                if (wordObj) {
                    // Tentar achar a tradução para a linguagem atual
                    const translation = wordObj.signos_constelacoes?.find(c => c.constelacao.toLowerCase() === userLanguage.toLowerCase());
                    const meaningToShow = translation ? translation.descodificacao : wordObj.codificacao_academica;

                    return (
                        <GlossaryWord 
                            key={i}
                            word={part}
                            translation={translation}
                            meaningToShow={meaningToShow}
                        />
                    );
                }
                
                return <React.Fragment key={i}>{part}</React.Fragment>;
            })}
        </span>
    );
}

function GlossaryWord({ word, translation, meaningToShow }: { word: string, translation: any, meaningToShow: string }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const tooltipRef = React.useRef<HTMLSpanElement>(null);

    // Fechar ao clicar fora
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <span 
            ref={tooltipRef}
            onClick={() => setIsOpen(!isOpen)}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            className="relative inline-block cursor-pointer font-semibold text-[#0055ff] border-b border-dashed border-[#0055ff] hover:text-brand-yellow hover:border-brand-yellow transition-colors"
        >
            {word}
            
            {/* Tooltip Popup */}
            {isOpen && (
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[85vw] md:w-max max-w-xs p-3 bg-[#1E1E1E] border border-brand-yellow/30 text-white text-xs font-sans rounded-xl shadow-2xl z-[100] before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-brand-yellow/30 animate-in fade-in slide-in-from-bottom-1 duration-200">
                    <span className="block font-bold text-brand-yellow uppercase tracking-wider mb-1 text-[10px]">
                        Glossário: {translation ? translation.constelacao : 'Acadêmica'}
                    </span>
                    <span className="text-gray-200 block text-left">
                        {meaningToShow}
                    </span>
                </span>
            )}
        </span>
    );
}
