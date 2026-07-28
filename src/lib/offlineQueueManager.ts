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

export interface OfflineActionItem {
    id: string;
    actionType: string;
    payload: any;
    timestamp: number;
}

const DB_NAME = 'hub_offline_db';
const STORE_NAME = 'hub_offline_queue';
export const BATCH_LIMIT = 57; // Limite estrito de 57 itens por batch

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined' || !('indexedDB' in window)) {
            reject(new Error('IndexedDB não suportado'));
            return;
        }

        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (event: any) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Adiciona uma interacao offline a fila do IndexedDB
 */
export async function enqueueOfflineAction(actionType: string, payload: any): Promise<void> {
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);

        const item: OfflineActionItem = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            actionType,
            payload,
            timestamp: Date.now(),
        };

        store.put(item);

        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    } catch (e) {
        console.warn('[Offline Queue] Erro ao salvar ação no IndexedDB:', e);
        // Fallback em localStorage se IndexedDB falhar
        try {
            const current = JSON.parse(localStorage.getItem('hub_offline_fallback_queue') || '[]');
            current.push({ actionType, payload, timestamp: Date.now() });
            localStorage.setItem('hub_offline_fallback_queue', JSON.stringify(current));
        } catch (_) {}
    }
}

/**
 * Retorna todos os itens pendentes na fila
 */
export async function getOfflineQueue(): Promise<OfflineActionItem[]> {
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    } catch (e) {
        return [];
    }
}

/**
 * Processa e envia a fila em lotes de ate 57 itens para o Supabase
 */
export async function flushOfflineQueueToSupabase(): Promise<{ processed: number; errors: number }> {
    const queue = await getOfflineQueue();
    if (queue.length === 0) return { processed: 0, errors: 0 };

    // Limita o lote atual para no maximo 57 itens
    const batch = queue.slice(0, BATCH_LIMIT);
    let processed = 0;
    let errors = 0;

    const db = await openDB();

    for (const item of batch) {
        try {
            // Executa o dispatch no servidor via Server Action / API correspondente
            if (item.actionType === 'UPDATE_ABSENCES') {
                const { updateSubjectAbsences } = await import('@/app/actions/absences');
                await updateSubjectAbsences(item.payload.subjectCode, item.payload.absences, item.payload.maxAbsences);
            }

            // Remove o item processado com sucesso do IndexedDB
            const tx = db.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).delete(item.id);
            processed++;
        } catch (err) {
            console.error('[Offline Queue] Erro ao processar item do lote:', item, err);
            errors++;
        }
    }

    return { processed, errors };
}
