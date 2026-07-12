/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import { fetchSubmissions, fetchTrendingSubmissions, getFeaturedSubmissions, getTrendingTags } from '@/app/actions/submissions';

export async function getInitialData() {
    const [submissionsResult, arteResult, trendingItems, featuredItems, trendingTags] = await Promise.all([
        fetchSubmissions({
            page: 1,
            limit: 12,
            query: '',
            sort: 'recentes',
            categories: [],
            excludeCategories: ['Arte']
        }),
        fetchSubmissions({
            page: 1,
            limit: 12,
            query: '',
            sort: 'recentes',
            categories: ['Arte']
        }),
        fetchTrendingSubmissions(),
        getFeaturedSubmissions(10),
        getTrendingTags()
    ]);

    return {
        initialItems: submissionsResult.items,
        initialHasMore: submissionsResult.hasMore,
        initialArteItems: arteResult.items,
        initialArteHasMore: arteResult.hasMore,
        trendingItems: trendingItems.map(item => ({ ...item, isTrending: true })),
        featuredItems: featuredItems.map(item => ({ ...item, isFeatured: true })),
        trendingTags
    };
}
