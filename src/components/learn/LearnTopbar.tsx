"use client";

import { signOut } from "next-auth/react";
import { User } from "next-auth";
import { Heart, Zap, Flame, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStats } from "@/hooks/useUserStats";

interface LearnTopbarProps {
  user: User & { id?: string };
}

export function LearnTopbar({ user }: LearnTopbarProps) {
  const { stats } = useUserStats();

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-6">
        {/* Hearts */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart
              key={i}
              className="h-5 w-5"
              fill={i < (stats?.hearts ?? 5) ? "#ef4444" : "none"}
              stroke={i < (stats?.hearts ?? 5) ? "#ef4444" : "#d1d5db"}
            />
          ))}
        </div>
        {/* XP */}
        <div className="flex items-center gap-1.5 text-amber-600">
          <Zap className="h-5 w-5 fill-amber-500 stroke-amber-500" />
          <span className="font-bold text-sm">{stats?.xp ?? 0} XP</span>
        </div>
        {/* Streak */}
        <div className="flex items-center gap-1.5 text-orange-500">
          <Flame className="h-5 w-5 fill-orange-500" />
          <span className="font-bold text-sm">{stats?.streakDays ?? 0}</span>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <span className="hidden md:block text-sm font-medium">{user.name ?? user.email}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="text-xs text-muted-foreground">{user.email}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
            <LogOut className="h-4 w-4 mr-2" />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
