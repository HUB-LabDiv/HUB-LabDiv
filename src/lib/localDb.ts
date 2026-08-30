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

import Dexie, { type EntityTable } from 'dexie';

// --- Interfaces para Tipagem do Banco Local ---

export interface LocalMutation {
  id: string; // UUID único para a mutation na fila local
  endpoint: string; // Para onde a action deveria ir
  payload: any; // Os dados da mutation
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  timestamp: number;
  status: 'pending' | 'syncing' | 'failed';
  retryCount: number;
  lastError?: string;
}

export interface LocalUserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: string;
  last_sync: number;
}

export interface LocalPermission {
  id: string;
  resource: string;
  action: string;
  granted: boolean;
}

// O banco central offline-first
export class AntigravityLocalDatabase extends Dexie {
  mutationsQueue!: EntityTable<LocalMutation, 'id'>;
  userProfile!: EntityTable<LocalUserProfile, 'id'>;
  permissions!: EntityTable<LocalPermission, 'id'>;
  // ... outras tabelas locais como 'grades', 'submissions', etc.

  constructor() {
    // Nome do banco no IndexedDB
    super('AntigravityLocalDB');
    
    // Definição do schema:
    // O '++id' auto-incrementa ou usamos string como Primary Key (aqui usamos UUID/string 'id')
    this.version(1).stores({
      mutationsQueue: 'id, status, timestamp', // Índices para busca rápida
      userProfile: 'id',
      permissions: 'id, resource'
    });
  }
}

// Instância global a ser consumida pela aplicação cliente
export const localDb = new AntigravityLocalDatabase();
