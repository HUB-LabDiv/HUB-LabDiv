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

import React, { useState } from 'react';
import { usePendingUploadsStore } from '@/store/usePendingUploadsStore';

interface CloudinaryUploaderProps {
    onUploadSuccess: (url: string) => void;
    accept: string;
    label: string;
    icon: string;
    /** Cloudinary resource type: 'auto' (padrão), 'raw' (para PDFs/docs), 'image', 'video' */
    resourceType?: 'auto' | 'raw' | 'image' | 'video';
}

export function CloudinaryUploader({ onUploadSuccess, accept, label, icon, resourceType = 'auto' }: CloudinaryUploaderProps) {
    const [error, setError] = useState('');
    const setPendingFile = usePendingUploadsStore((state) => state.setPendingFile);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            setError('O arquivo excede o limite de 10MB.');
            return;
        }

        setError('');

        try {
            // Generate local preview URL
            const localUrl = URL.createObjectURL(file);
            
            // Register file in the pending uploads store
            setPendingFile(localUrl, file, resourceType);
            
            // Trigger success callback with local URL instantly
            onUploadSuccess(localUrl);
        } catch (err: any) {
            console.error('Local file load failed:', err);
            setError(err.message || 'Falha ao carregar arquivo local.');
        }
    };

    return (
        <div className="flex flex-col items-center gap-1 mt-2 w-full">
            <label className="flex items-center gap-2 px-4 py-2 bg-brand-blue hover:bg-brand-blue/80 text-white text-sm font-bold rounded-lg cursor-pointer transition-colors shadow-lg shadow-brand-blue/20">
                <span className="material-symbols-outlined">{icon || 'upload'}</span>
                {label || 'Selecionar Arquivo'}
                <input 
                    type="file" 
                    accept={accept}
                    className="hidden" 
                    onChange={handleUpload}
                />
            </label>
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest text-center mt-1">
                Visualização instantânea (até 10MB)
            </span>
            {error && <span className="text-gray-200 text-xs font-bold text-center mt-1">{error}</span>}
        </div>
    );
}
