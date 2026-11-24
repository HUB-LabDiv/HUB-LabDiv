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

export default function DataPipelineLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
      <div className="rounded-3xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 p-6 space-y-3">
        <div className="h-7 w-72 rounded-xl bg-gray-200 dark:bg-white/10" />
        <div className="h-4 w-96 max-w-full rounded-lg bg-gray-100 dark:bg-white/5" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 p-4 space-y-2"
          >
            <div className="h-3 w-24 rounded bg-gray-200 dark:bg-white/10" />
            <div className="h-6 w-16 rounded bg-gray-300 dark:bg-white/15" />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 w-28 rounded-full bg-gray-200 dark:bg-white/10" />
        ))}
      </div>

      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-48 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 p-6 space-y-4"
          >
            <div className="h-5 w-64 rounded bg-gray-200 dark:bg-white/10" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="h-24 rounded-2xl bg-gray-100 dark:bg-white/5" />
              <div className="h-24 rounded-2xl bg-gray-100 dark:bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
