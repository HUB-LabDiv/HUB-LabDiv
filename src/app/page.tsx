import { Header } from "@/components/layout/Header";
import { SidebarLeft } from "@/components/layout/SidebarLeft";
import { SidebarRight } from "@/components/layout/SidebarRight";
import HomeClientView from "@/components/layout/HomeClientView";
import { getInitialData } from "@/lib/data-fetching";

export default async function HomePage() {
  const data = await getInitialData();

  return (
    <div className="flex min-h-screen bg-background dark:bg-background-dark">
      <SidebarLeft />
      <main className="flex-1 border-x border-border dark:border-border-dark">
        <Header />
        <HomeClientView initialData={data} />
      </main>
      <SidebarRight />
    </div>
  );
}
