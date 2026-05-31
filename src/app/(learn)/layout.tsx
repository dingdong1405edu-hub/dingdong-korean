import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LearnSidebar } from "@/components/learn/LearnSidebar";
import { LearnTopbar } from "@/components/learn/LearnTopbar";

export default async function LearnLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen flex">
      <LearnSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <LearnTopbar user={session.user} />
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
