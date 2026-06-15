import React, { useState } from 'react';
import { generateCloudinarySignature } from '@/app/actions/media';

interface CloudinaryUploaderProps {
    onUploadSuccess: (url: string) => void;
    accept: string;
    label: string;
    icon: string;
}

export function CloudinaryUploader({ onUploadSuccess, accept, label, icon }: CloudinaryUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            setError('O arquivo excede o limite de 10MB.');
            return;
        }

        setIsUploading(true);
        setError('');

        try {
            const signatureData = await generateCloudinarySignature();
            if ('error' in signatureData) {
                throw new Error(signatureData.error);
            }

            const { signature, timestamp, cloudName, apiKey, folder } = signatureData;
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', apiKey!);
            formData.append('timestamp', String(timestamp));
            formData.append('signature', signature);
            formData.append('folder', folder);

            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || 'Erro no upload');
            
            onUploadSuccess(data.secure_url);
        } catch (err: any) {
            console.error('Upload failed:', err);
            setError(err.message || 'Falha no upload do arquivo.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-1 mt-2 w-full">
            <label className="flex items-center gap-2 px-4 py-2 bg-brand-blue hover:bg-brand-blue/80 text-white text-sm font-bold rounded-lg cursor-pointer transition-colors shadow-lg shadow-brand-blue/20">
                <span className="material-symbols-outlined">{isUploading ? 'hourglass_empty' : 'upload'}</span>
                {isUploading ? 'Enviando...' : `Enviar Arquivo do Computador`}
                <input 
                    type="file" 
                    accept={accept}
                    className="hidden" 
                    onChange={handleUpload}
                    disabled={isUploading}
                />
            </label>
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest text-center mt-1">
                Anexar arquivos de até 10MB
            </span>
            {error && <span className="text-brand-red text-xs font-bold text-center mt-1">{error}</span>}
        </div>
    );
}
