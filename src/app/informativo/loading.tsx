/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

export default function InformativoLoading() {
    return (
        <div className="w-full space-y-6 animate-pulse">
            <div className="h-36 rounded-3xl bg-gray-200/70 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-44 rounded-2xl bg-gray-200/60 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10"
                    />
                ))}
            </div>
        </div>
    );
}

