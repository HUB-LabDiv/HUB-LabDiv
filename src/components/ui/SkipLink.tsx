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


import React from 'react';

export const SkipLink = () => {
    return (
        <a
            href="#main-content"
            className="fixed top-[-100px] left-4 z-[999] bg-brand-blue text-white px-6 py-3 rounded-xl font-bold transition-all focus:top-4 focus:shadow-2xl"
        >
            Pular para o conteúdo
        </a>
    );
};
