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


import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { useState, useEffect } from 'react';
import { offlineCrud } from '@/lib/offline-sync';

// O persister padrão do TanStack Query salva no localStorage, o que tem limite baixo (5MB).
// Para alta escalabilidade, combinamos o TanStack Query com a nossa Durable Queue no Dexie.
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Cache agressivo (Stale time alto) para leitura offline-first
        staleTime: 1000 * 60 * 5, // 5 minutos
        gcTime: 1000 * 60 * 60 * 24, // Mantém em cache por 24 horas
        retry: 2,
      },
      mutations: {
        // Antigravity: Passo 5.1 - Controle de Retentativas e Backoff
        // Se a requisição falhar (ex: rede caiu ou servidor sobrecarregado),
        // o TanStack Query usará Exponential Backoff.
        // Tentativas ocorrerão após 2s, 4s, 8s, 16s... protegendo nosso servidor de 
        // um Thundering Herd (Efeito Manada) quando centenas de usuários voltarem online juntos.
        retry: (failureCount, error) => {
          if (typeof window !== 'undefined' && !navigator.onLine) {
            return false; // Não tenta novamente se estiver sem internet para não travar o botão em loading
          }
          return failureCount < 5;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Max delay de 30s
        
        // Antes de tentar a rede, interceptamos a mutation
        onMutate: async (variables) => {
          // Antigravity: A mutation OBRIGATORIAMENTE entra na Durable Queue do Dexie ANTES de ir para a rede.
          // Isso garante zero perda de dados.
          const mutationId = await offlineCrud.enqueueMutation({
            endpoint: '/api/sync',
            payload: variables,
            method: 'POST'
          });
          
          return { mutationId }; // Passamos o ID local pelo contexto
        },
        onSuccess: async (data, variables, context: any) => {
          // Se deu sucesso na rede, removemos da fila local
          if (context?.mutationId) {
            import('@/lib/localDb').then(({ localDb }) => {
              localDb.mutationsQueue.delete(context.mutationId);
            });
          }
        },
      }
    },
  }));

  // Previne Hydration Mismatch: renderiza o Provider normal no SSR e o Persist no Cliente.
  // Como o PersistQueryClientProvider não afeta o DOM dos children, não há erro de hydrate.
  if (typeof window === 'undefined') {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  const syncPersister = createSyncStoragePersister({
    storage: window.localStorage,
  });

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: syncPersister }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
