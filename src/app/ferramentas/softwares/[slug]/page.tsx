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

import { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { isUserAllowedSoftwaresTab } from '@/constants/softwares';
import { fetchSoftwareBySlug, fetchSoftwareFeedbacks } from '@/app/actions/softwares';
import { SoftwareGuideView } from '@/components/ferramentas/softwares/SoftwareGuideView';

export const revalidate = 0;

interface SoftwareDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: SoftwareDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const software = await fetchSoftwareBySlug(slug);

    if (!software) {
        return {
            title: 'Software Não Encontrado | Hub Lab-Div IFUSP',
        };
    }

    return {
        title: `${software.title} • Guia & Download | Hub Lab-Div IFUSP`,
        description: software.tagline,
    };
}

export default async function SoftwareDetailPage({ params }: SoftwareDetailPageProps) {
    const { slug } = await params;
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Whitelist guard
    if (!isUserAllowedSoftwaresTab(user.id)) {
        redirect('/ferramentas');
    }

    const software = await fetchSoftwareBySlug(slug, user.id);

    if (!software) {
        notFound();
    }

    const feedbacks = await fetchSoftwareFeedbacks(software.id);

    return (
        <SoftwareGuideView
            software={software}
            initialFeedbacks={feedbacks}
            currentUserId={user.id}
        />
    );
}
