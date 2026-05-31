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
  { href: "/dashboard", icon: LayoutDashboard, label: "Tổng quan", ko: "대시보드" },
  { href: "/hangul", icon: AlignLeft, label: "Hangul", ko: "한글" },
  { href: "/vocab", icon: BookMarked, label: "Từ vựng", ko: "어휘" },
  { href: "/grammar", icon: GraduationCap, label: "Ngữ pháp", ko: "문법" },
  { href: "/reading", icon: BookOpen, label: "Đọc hiểu", ko: "읽기" },
  { href: "/listening", icon: Headphones, label: "Nghe hiểu", ko: "듣기" },
  { href: "/writing", icon: PenLine, label: "Viết luận", ko: "쓰기" },
  { href: "/speaking", icon: Mic, label: "Luyện nói", ko: "말하기" },
];

export function LearnSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen sticky top-0 shrink-0"
      style={{ background: "hsl(222 47% 11%)" }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: "hsl(222 32% 18%)" }}>
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-300 font-bold text-sm">韓</span>
          </div>
          <div className="leading-none">
            <p className="font-bold text-white text-sm">DingDong</p>
            <p className="text-[11px] mt-0.5" style={{ color: "hsl(215 20% 55%)" }}>Korean</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                active
                  ? "text-white"
                  : "text-slate-400 hover:text-slate-100"
              )}
              style={active ? { background: "rgba(255,255,255,0.1)" } : undefined}
              onMouseEnter={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.background = "";
              }}
            >
              <item.icon className={cn(
                "h-4.5 w-4.5 flex-shrink-0 transition-colors",
                active ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
              )} style={{ width: "1.125rem", height: "1.125rem" }} />
              <span className="flex-1">{item.label}</span>
              <span className={cn(
                "text-[10px] hangul-text transition-opacity",
                active ? "opacity-60 text-blue-300" : "opacity-0 group-hover:opacity-40 text-slate-400"
              )}>{item.ko}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t" style={{ borderColor: "hsl(222 32% 18%)" }}>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-3 py-2.5 text-center">
          <p className="text-xs text-blue-300 font-medium">TOPIK I → II</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Học theo lộ trình</p>
        </div>
      </div>
    </aside>
  );
}
