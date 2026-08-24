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

import { Header } from "@/components/layout/Header";
import { SidebarLeft } from "@/components/layout/SidebarLeft";
import { SidebarRight } from "@/components/layout/SidebarRight";
import { HomeClientView } from "@/components/layout/HomeClientView";
import { getInitialData } from "../lib/data-fetching";

import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';
import { 
    fetchSubmissions, 
    fetchTrendingSubmissions, 
    getFeaturedSubmissions 
} from '@/app/actions/submissions';
import { ComunidadeClient } from '@/components/comunidade/ComunidadeClient';

export default async function HomePage() {
  const data = await getInitialData();

  return (
    <MainLayoutWrapper rightSidebar={<SidebarRight />} fullWidth>
      <HomeClientView {...data} />
    </MainLayoutWrapper>
  );
}


