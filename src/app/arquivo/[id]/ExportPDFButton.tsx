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


import { toast } from 'react-hot-toast';

export function ExportPDFButton() {
    const handlePrint = () => {
        toast.success("Otimizando layout para PDF...", { icon: '📄' });
        setTimeout(() => {
            window.print();
        }, 800);
    };

    return (
        <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-brand-blue/10 hover:text-brand-blue text-gray-600 dark:text-gray-300 font-bold rounded-xl text-sm transition-all border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md"
            title="Exportar como PDF (inclui fórmulas KaTeX)"
        >
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            Exportar PDF
        </button>
    );
}
