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

import 'server-only';
import { unstable_cache } from 'next/cache';
import { createSupabaseStatic } from '@/lib/supabase/server';
import { institutoData, type Department } from '@/data/institutoData';
import { initiativesData } from '@/data/initiativesData';
import { eventsData } from '@/data/eventsData';
import { newsData } from '@/data/newsData';
import { spacesData } from '@/data/spacesData';
import { disciplinesData } from '@/data/disciplinesData';
import { coursesData } from '@/data/coursesData';
import type { Initiative } from '@/types/initiatives';
import type { EventItem } from '@/types/events';
import type { NewsItem } from '@/types/news';
import type { SpaceItem } from '@/types/spaces';
import type { CourseId, CourseCurriculum, DisciplineItem } from '@/types/curriculum';
import type { PipelineModule } from '@/types/data-pipeline';

async function loadSnapshotWithFallback<T>(module: PipelineModule, fallback: T): Promise<T> {
  try {
    const supabase = await createSupabaseStatic();
    const { data, error } = await supabase
      .from('official_data_snapshots')
      .select('payload')
      .eq('module', module)
      .maybeSingle();

    if (error || !data?.payload) {
      return fallback;
    }
    return data.payload as T;
  } catch {
    return fallback;
  }
}

export const getOfficialInstitutoData = unstable_cache(
  () => loadSnapshotWithFallback<Record<string, Department>>('departments', institutoData),
  ['official-data', 'departments'],
  { tags: ['official-data', 'official-data:departments'], revalidate: 86400 }
);

export const getOfficialInitiativesData = unstable_cache(
  () => loadSnapshotWithFallback<Record<string, Initiative>>('initiatives', initiativesData),
  ['official-data', 'initiatives'],
  { tags: ['official-data', 'official-data:initiatives'], revalidate: 86400 }
);

export const getOfficialEventsData = unstable_cache(
  () => loadSnapshotWithFallback<Record<string, EventItem>>('events', eventsData),
  ['official-data', 'events'],
  { tags: ['official-data', 'official-data:events'], revalidate: 86400 }
);

export const getOfficialNewsData = unstable_cache(
  () => loadSnapshotWithFallback<NewsItem[]>('news', newsData),
  ['official-data', 'news'],
  { tags: ['official-data', 'official-data:news'], revalidate: 86400 }
);

export const getOfficialSpacesData = unstable_cache(
  () => loadSnapshotWithFallback<Record<string, SpaceItem>>('spaces', spacesData),
  ['official-data', 'spaces'],
  { tags: ['official-data', 'official-data:spaces'], revalidate: 86400 }
);

export const getOfficialDisciplinesData = unstable_cache(
  () => loadSnapshotWithFallback<Record<string, DisciplineItem>>('disciplines', disciplinesData),
  ['official-data', 'disciplines'],
  { tags: ['official-data', 'official-data:disciplines'], revalidate: 86400 }
);

export const getOfficialCoursesData = unstable_cache(
  () => loadSnapshotWithFallback<Record<CourseId, CourseCurriculum>>('courses', coursesData),
  ['official-data', 'courses'],
  { tags: ['official-data', 'official-data:courses'], revalidate: 86400 }
);
