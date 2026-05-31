import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TOPIK_LEVEL_LABELS, TOPIK_LEVEL_COLORS } from "@/lib/utils";
import {
  AlignLeft, BookOpen, Headphones, PenLine, Mic, BookMarked, GraduationCap,
  Zap, Heart, Flame, Trophy
} from "lucide-react";

const modules = [
  { href: "/hangul", icon: AlignLeft, label: "Hangul", desc: "한글 • Bảng chữ cái", color: "bg-pink-50 border-pink-200 hover:bg-pink-100" },
  { href: "/vocab", icon: BookMarked, label: "Từ vựng", desc: "어휘 • TOPIK I–VI", color: "bg-blue-50 border-blue-200 hover:bg-blue-100" },
  { href: "/grammar", icon: GraduationCap, label: "Ngữ pháp", desc: "문법 • Grammar patterns", color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100" },
  { href: "/reading", icon: BookOpen, label: "Đọc hiểu", desc: "읽기 • Reading", color: "bg-green-50 border-green-200 hover:bg-green-100" },
  { href: "/listening", icon: Headphones, label: "Nghe hiểu", desc: "듣기 • Listening", color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100" },
  { href: "/writing", icon: PenLine, label: "Viết luận", desc: "쓰기 • Writing + AI grade", color: "bg-orange-50 border-orange-200 hover:bg-orange-100" },
  { href: "/speaking", icon: Mic, label: "Luyện nói", desc: "말하기 • Speaking + AI", color: "bg-purple-50 border-purple-200 hover:bg-purple-100" },
];

export default async function DashboardPage() {
  const session = await auth();
  const user = await db.user.findUnique({
    where: { id: session!.user!.id },
    include: {
      _count: {
        select: { attempts: true },
      },
    },
  });

  if (!user) return null;

  const levelLabel = TOPIK_LEVEL_LABELS[user.topikLevel] ?? "TOPIK I";
  const levelColor = TOPIK_LEVEL_COLORS[user.topikLevel] ?? "bg-green-100 text-green-800";
  const xpProgress = Math.min((user.xp % 1000) / 10, 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">Xin chào, {user.name?.split(" ").at(-1) ?? "bạn"} 👋</h1>
        <p className="text-muted-foreground mt-1">Tiếp tục hành trình học tiếng Hàn của bạn</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Zap className="h-5 w-5 text-amber-600 fill-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{user.xp}</p>
              <p className="text-xs text-muted-foreground">XP tổng</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="h-5 w-5 text-red-500 fill-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{user.hearts}/5</p>
              <p className="text-xs text-muted-foreground">Mạng sống</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Flame className="h-5 w-5 text-orange-500 fill-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{user.streakDays}</p>
              <p className="text-xs text-muted-foreground">Ngày liên tiếp</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Trophy className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{user._count.attempts}</p>
              <p className="text-xs text-muted-foreground">Bài đã làm</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level & XP progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Mục tiêu:</span>
              <Badge className={levelColor}>{levelLabel}</Badge>
            </div>
            <span className="text-sm text-muted-foreground">{user.xp} XP</span>
          </div>
          <Progress value={xpProgress} className="h-3" />
          <p className="text-xs text-muted-foreground mt-1">{Math.round(xpProgress)}% đến level tiếp theo</p>
        </CardContent>
      </Card>

      {/* Module cards */}
      <div>
        <h2 className="font-semibold text-lg mb-3">Chọn kỹ năng để học</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => (
            <Link key={m.href} href={m.href}>
              <Card className={`border-2 transition-all cursor-pointer ${m.color}`}>
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <m.icon className="h-6 w-6 text-zinc-700" />
                  </div>
                  <div>
                    <p className="font-semibold">{m.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
