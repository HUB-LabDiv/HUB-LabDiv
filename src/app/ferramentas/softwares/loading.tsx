/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 *
 * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

export default function SoftwaresLoading() {
    return (
        <div className="w-full space-y-6 animate-pulse">
            {/* Header Hero Skeleton */}
            <div className="h-48 rounded-3xl bg-[#1E1E1E] border border-white/5 p-8 flex flex-col justify-between">
                <div className="space-y-3">
                    <div className="w-48 h-5 rounded-full bg-white/10" />
                    <div className="w-96 max-w-full h-8 rounded-xl bg-white/10" />
                    <div className="w-72 max-w-full h-4 rounded-lg bg-white/5" />
                </div>
            </div>

            {/* Filter Bar Skeleton */}
            <div className="flex gap-3">
                <div className="flex-1 h-12 rounded-2xl bg-[#1E1E1E] border border-white/5" />
                <div className="w-48 h-12 rounded-2xl bg-[#1E1E1E] border border-white/5" />
            </div>

            {/* Categories Pills Skeleton */}
            <div className="flex gap-2">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-24 h-8 rounded-xl bg-[#1E1E1E] border border-white/5" />
                ))}
            </div>

            {/* Grid of Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="h-80 rounded-3xl bg-[#1E1E1E] border border-white/5 p-6 flex flex-col justify-between"
                    >
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <div className="w-24 h-5 rounded-full bg-white/10" />
                                <div className="w-12 h-5 rounded-full bg-white/5" />
                            </div>
                            <div className="w-40 h-6 rounded-lg bg-white/10" />
                            <div className="w-full h-16 rounded-lg bg-white/5" />
                        </div>
                        <div className="h-10 rounded-2xl bg-white/10" />
                    </div>
                ))}
            </div>
        </div>
    );
}
