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

import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';
import { SidebarRight } from '@/components/layout/SidebarRight';
import { FluxoFeedbackCard } from "@/components/feedback/FluxoFeedbackCard";
import { 
    fetchSubmissions, 
    fetchTrendingSubmissions, 
    getFeaturedSubmissions 
} from '@/app/actions/submissions';
import { ComunidadeClient } from '@/components/comunidade/ComunidadeClient';

export default async function Home() {
    // Fetch initial data for the Comunidade Hub
    const [submissions, trending, featured] = await Promise.all([
        fetchSubmissions({ page: 1, limit: 12, query: '', sort: 'recentes' }),
        fetchTrendingSubmissions(),
        getFeaturedSubmissions(3)
    ]);

    const initialFluxoData = {
        items: submissions.items,
        hasMore: submissions.hasMore,
        trendingItems: trending,
        featuredItems: featured,
    };

    return (
        <MainLayoutWrapper
            userId={undefined}
            rightSidebar={<><FluxoFeedbackCard /><SidebarRight /></>}
            fullWidth={true}
        >
            <ComunidadeClient initialFluxoData={initialFluxoData} />
        </MainLayoutWrapper>
    );
}
