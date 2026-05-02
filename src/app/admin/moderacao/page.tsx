import { SubmissionsManager } from "../../../components/admin/moderacao/SubmissionsManager";
import { Suspense } from "react";
import Skeleton from "../../../components/ui/Skeleton";

export const dynamic = "force-dynamic";

import { MainLayoutWrapper } from "../../../components/layout/MainLayoutWrapper";

export default async function ModeracaoPage() {
  return (
    <MainLayoutWrapper>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Moderação de Conteúdo</h1>
        <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
          <SubmissionsManager />
        </Suspense>
      </div>
    </MainLayoutWrapper>
  );
}


