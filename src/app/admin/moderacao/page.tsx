import { getSubmissions, getCategories } from "@/app/actions/submissions";
import SubmissionsManager from "@/components/admin/moderacao/SubmissionsManager";
import { Suspense } from "react";
import Skeleton from "@/components/ui/Skeleton";

export const dynamic = "force-dynamic";

export default async function ModeracaoPage() {
  const [submissions, categories] = await Promise.all([
    getSubmissions(),
    getCategories(),
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Moderação de Conteúdo</h1>
      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <SubmissionsManager 
          initialSubmissions={submissions} 
          categories={categories} 
        />
      </Suspense>
    </div>
  );
}
