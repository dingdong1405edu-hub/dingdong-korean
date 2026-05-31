import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TOPIK_LEVEL_LABELS, TOPIK_LEVEL_COLORS } from "@/lib/utils";
import {
  AlignLeft, BookOpen, Headphones, PenLine, Mic, BookMarked, GraduationCap,
  Zap, Heart, Flame, Trophy, TrendingUp, ArrowRight
} from "lucide-react";

const modules = [
  {
    href: "/hangul",
    icon: AlignLeft,
    label: "Hangul",
    labelKo: "한글",
    desc: "Jamo, âm tiết, batchim",
    gradient: "from-pink-500 to-rose-500",
    bg: "bg-pink-50",
    border: "border-pink-100 hover:border-pink-300",
    iconBg: "bg-gradient-to-br from-pink-500 to-rose-500",
  },
  {
    href: "/vocab",
    icon: BookMarked,
    label: "Từ vựng",
    labelKo: "어휘",
    desc: "TOPIK I–VI Duolingo",
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    border: "border-blue-100 hover:border-blue-300",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
  },
  {
    href: "/grammar",
    icon: GraduationCap,
    label: "Ngữ pháp",
    labelKo: "문법",
    desc: "Pattern + chia động từ",
    gradient: "from-indigo-500 to-violet-500",
    bg: "bg-indigo-50",
    border: "border-indigo-100 hover:border-indigo-300",
    iconBg: "bg-gradient-to-br from-indigo-500 to-violet-500",
  },
  {
    href: "/reading",
    icon: BookOpen,
    label: "Đọc hiểu",
    labelKo: "읽기",
    desc: "Chuẩn TOPIK + lookup",
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100 hover:border-emerald-300",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
  },
  {
    href: "/listening",
    icon: Headphones,
    label: "Nghe hiểu",
    labelKo: "듣기",
    desc: "Seoul dialect audio",
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    border: "border-amber-100 hover:border-amber-300",
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
  },
  {
    href: "/writing",
    icon: PenLine,
    label: "Viết luận",
    labelKo: "쓰기",
    desc: "TOPIK 51/52/53 + AI",
    gradient: "from-orange-500 to-red-500",
    bg: "bg-orange-50",
    border: "border-orange-100 hover:border-orange-300",
    iconBg: "bg-gradient-to-br from-orange-500 to-red-500",
  },
  {
    href: "/speaking",
    icon: Mic,
    label: "Luyện nói",
    labelKo: "말하기",
    desc: "Deepgram + AI grade",
    gradient: "from-purple-500 to-fuchsia-500",
    bg: "bg-purple-50",
    border: "border-purple-100 hover:border-purple-300",
    iconBg: "bg-gradient-to-br from-purple-500 to-fuchsia-500",
  },
];

export default async function DashboardPage() {
  const session = await auth();
  const user = await db.user.findUnique({
    where: { id: session!.user!.id },
    include: {
      _count: { select: { attempts: true } },
    },
  });

  if (!user) return null;

  const firstName = user.name?.split(" ").at(-1) ?? "bạn";
  const levelLabel = TOPIK_LEVEL_LABELS[user.topikLevel] ?? "TOPIK I";
  const levelColor = TOPIK_LEVEL_COLORS[user.topikLevel] ?? "topik-1";
  const xpProgress = Math.min((user.xp % 1000) / 10, 100);
  const xpToNext = 1000 - (user.xp % 1000);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Xin chào, {firstName}! 👋
          </h1>
          <p className="text-slate-500 mt-1">Tiếp tục hành trình học tiếng Hàn của bạn</p>
        </div>
        <Badge className={`topik-badge topik-${user.topikLevel.replace("TOPIK", "").toLowerCase()} text-xs`}>
          {levelLabel}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={<Zap className="w-5 h-5 text-amber-500 fill-amber-400" />}
          iconBg="bg-amber-50 border-amber-100"
          value={user.xp.toLocaleString()}
          label="Tổng XP"
          color="text-amber-700"
        />
        <StatCard
          icon={<Heart className="w-5 h-5 text-red-500 fill-red-400" />}
          iconBg="bg-red-50 border-red-100"
          value={`${user.hearts}/5`}
          label="Mạng sống"
          color="text-red-700"
        />
        <StatCard
          icon={<Flame className="w-5 h-5 text-orange-500 fill-orange-400" />}
          iconBg="bg-orange-50 border-orange-100"
          value={String(user.streakDays)}
          label="Ngày liên tiếp"
          color="text-orange-700"
        />
        <StatCard
          icon={<Trophy className="w-5 h-5 text-purple-500" />}
          iconBg="bg-purple-50 border-purple-100"
          value={String(user._count.attempts)}
          label="Bài đã làm"
          color="text-purple-700"
        />
      </div>

      {/* XP Progress */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Tiến độ level</p>
              <p className="text-xs text-slate-400">Mục tiêu: {levelLabel}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900">{user.xp} XP</p>
            <p className="text-xs text-slate-400">còn {xpToNext} XP</p>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${xpProgress}%` }} />
        </div>
        <p className="text-xs text-slate-400 mt-1.5">{Math.round(xpProgress)}% đến level tiếp theo</p>
      </div>

      {/* Modules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Chọn kỹ năng để học</h2>
          <span className="text-xs text-slate-400">{modules.length} modules</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {modules.map((m) => (
            <Link key={m.href} href={m.href} className="group">
              <div className={`${m.bg} border-2 ${m.border} rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}>
                <div className={`w-10 h-10 rounded-xl ${m.iconBg} flex items-center justify-center mb-3 shadow-sm`}>
                  <m.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="font-semibold text-sm text-slate-800">{m.label}</p>
                      <span className="text-xs text-slate-400 hangul-text">{m.labelKo}</span>
                    </div>
                    <p className="text-xs text-slate-500">{m.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors mt-0.5 flex-shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  iconBg,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  iconBg: string;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-md transition-shadow">
      <div className={`w-9 h-9 ${iconBg} border rounded-xl flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}
