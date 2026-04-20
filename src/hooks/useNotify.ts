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

import { toast } from 'react-hot-toast';

/**
 * useNotify Hook
 * Atomic logic for premium notifications and error handling.
 * Avoids scattered try/catch blocks in UI components.
 */
export const useNotify = () => {
    const success = (message: string) => {
        toast.success(message, {
            icon: '✅',
            style: {
                border: '1px solid #10b981',
                background: '#064e3b',
                color: '#fff',
            },
        });
    };

    const error = (message: string, err?: any) => {
        console.error('🚨 Notification Error:', err || message);

        toast.error(message, {
            icon: '❌',
            style: {
                border: '1px solid #ef4444',
                background: '#450a0a',
                color: '#fff',
            },
        });
    };

    const promise = async <T,>(
        fn: Promise<T> | { then: (onfulfilled?: (value: T) => any) => any },
        {
            loading = 'Processando...',
            success: successMsg = 'Sucesso!',
            error: errorMsg = 'Ocorreu um erro.'
        }: { loading?: string; success?: string; error?: string } = {}
    ) => {
        return toast.promise(
            fn as Promise<T>,
            {
                loading,
                success: successMsg,
                error: errorMsg,
            }
        ).then((data) => ({ data, error: null }))
            .catch((error) => ({ data: null, error }));
    };

    return { success, error, promise };
};
