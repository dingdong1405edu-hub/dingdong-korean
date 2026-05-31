"use client";

import { signOut } from "next-auth/react";
import { User } from "next-auth";
import { Heart, Zap, Flame, LogOut, ChevronDown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStats } from "@/hooks/useUserStats";

interface LearnTopbarProps {
  user: User & { id?: string };
}

export function LearnTopbar({ user }: LearnTopbarProps) {
  const { stats } = useUserStats();

  const hearts = stats?.hearts ?? 5;
  const xp = stats?.xp ?? 0;
  const streak = stats?.streakDays ?? 0;

  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
      {/* Stats */}
      <div className="flex items-center gap-1">
        {/* Hearts */}
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 border border-red-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart
              key={i}
              className="w-3.5 h-3.5 transition-all"
              fill={i < hearts ? "#ef4444" : "none"}
              stroke={i < hearts ? "#ef4444" : "#fca5a5"}
            />
          ))}
        </div>

        {/* XP */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-100 ml-2">
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold text-amber-700">{xp.toLocaleString()}</span>
          <span className="text-xs text-amber-500">XP</span>
        </div>

        {/* Streak */}
        {streak > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-100 ml-2">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-400" />
            <span className="text-xs font-bold text-orange-700">{streak}</span>
            <span className="text-xs text-orange-500">ngày</span>
          </div>
        )}
      </div>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 h-9 px-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <span className="hidden md:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
              {user.name ?? user.email}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-lg border-slate-200">
          <DropdownMenuLabel className="pb-1">
            <p className="text-sm font-semibold text-slate-800">{user.name}</p>
            <p className="text-xs text-slate-400 font-normal truncate">{user.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-slate-600 cursor-pointer">
            <Settings className="h-4 w-4 mr-2 text-slate-400" />
            Cài đặt
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-red-600 cursor-pointer focus:text-red-700 focus:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
