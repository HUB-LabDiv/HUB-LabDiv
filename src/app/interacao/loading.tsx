/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

export default function RouteSkeletonLoading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-pulse">
            <div className="h-12 w-64 mx-auto rounded-2xl bg-gray-200/70 dark:bg-white/10" />
            <div className="h-40 rounded-3xl bg-gray-200/60 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-48 rounded-2xl bg-gray-200/60 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10"
                    />
                ))}
            </div>
        </div>
    );
}

