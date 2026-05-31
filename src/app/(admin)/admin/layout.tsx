import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, BookOpen, Headphones, PenLine, Mic,
  BookMarked, GraduationCap, Users, AlignLeft, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

const adminNav = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/hangul", icon: AlignLeft, label: "Hangul Sets" },
  { href: "/admin/vocab", icon: BookMarked, label: "Vocab Units" },
  { href: "/admin/grammar", icon: GraduationCap, label: "Grammar Units" },
  { href: "/admin/reading", icon: BookOpen, label: "Reading Tests" },
  { href: "/admin/listening", icon: Headphones, label: "Listening Tests" },
  { href: "/admin/writing", icon: PenLine, label: "Writing Tasks" },
  { href: "/admin/speaking", icon: Mic, label: "Speaking Sets" },
  { href: "/admin/users", icon: Users, label: "Users" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = (session?.user ?? {}) as { role?: string };

  if (!session?.user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r flex flex-col min-h-screen sticky top-0">
        <div className="p-4 border-b">
          <Link href="/admin" className="flex items-center gap-2 font-bold">
            <span className="text-xl">🔔</span>
            <span className="text-sm">Admin Panel</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t">
          <Link href="/dashboard" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
            ← Learner mode
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
