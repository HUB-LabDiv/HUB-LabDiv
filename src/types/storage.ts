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

export type StorageProvider = 'cloudinary' | 'firestick' | 'supabase';

export interface FirestickUploadResponse {
    success: boolean;
    filename: string;
    url: string;
    size: number;
    mimetype: string;
    error?: string;
}

export interface FirestickHealthStatus {
    online: boolean;
    uptime?: number;
    device?: string;
    error?: string;
}

export interface MediaMirrorRecord {
    id: string;
    primary_url: string;
    primary_provider: StorageProvider;
    backup_url: string | null;
    firestick_filename: string | null;
    mime_type: string | null;
    size_bytes: number | null;
    mirror_status: 'synced' | 'pending' | 'primary_only';
    uploaded_by?: string | null;
    created_at: string;
}

export interface HybridStorageOverview {
    firestickHealth: FirestickHealthStatus;
    totalTracked: number;
    syncedCount: number;
    pendingCount: number;
    primaryOnlyCount: number;
}

