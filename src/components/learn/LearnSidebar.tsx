"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  AlignLeft,
  BookOpen,
  Headphones,
  PenLine,
  Mic,
  BookMarked,
  GraduationCap,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Tổng quan" },
  { href: "/hangul", icon: AlignLeft, label: "Hangul 한글" },
  { href: "/vocab", icon: BookMarked, label: "Từ vựng" },
  { href: "/grammar", icon: GraduationCap, label: "Ngữ pháp" },
  { href: "/reading", icon: BookOpen, label: "Đọc hiểu" },
  { href: "/listening", icon: Headphones, label: "Nghe hiểu" },
  { href: "/writing", icon: PenLine, label: "Viết luận" },
  { href: "/speaking", icon: Mic, label: "Luyện nói" },
];

export function LearnSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-white min-h-screen sticky top-0">
      <div className="p-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-2xl">🔔</span>
          <span>DingDong</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
