import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen, Headphones, PenLine, Mic, BookMarked, GraduationCap,
  AlignLeft, Star, ArrowRight, CheckCircle2, Zap
} from "lucide-react";

const features = [
  {
    icon: AlignLeft,
    title: "Hangul 한글",
    desc: "Học bảng chữ cái từ jamo đến âm tiết ghép với quiz tương tác",
    color: "from-pink-500 to-rose-500",
    bg: "bg-pink-50",
    border: "border-pink-100",
  },
  {
    icon: BookMarked,
    title: "Từ vựng",
    desc: "800+ từ TOPIK I–VI theo chủ đề, gamified với XP & streak",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: GraduationCap,
    title: "Ngữ pháp",
    desc: "Patterns -(으)면, -아/어서, -기 때문에... với bài tập chia động từ",
    color: "from-indigo-500 to-violet-500",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
  {
    icon: BookOpen,
    title: "Đọc hiểu",
    desc: "Bài đọc chuẩn TOPIK + click-to-lookup từ vựng tức thì",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: Headphones,
    title: "Nghe hiểu",
    desc: "Audio hội thoại Seoul dialect, speed control 0.75×–1.5×",
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    icon: PenLine,
    title: "Viết luận",
    desc: "TOPIK 51/52/53 — AI chấm ngữ pháp, từ vựng, văn phong 합쇼체",
    color: "from-orange-500 to-red-500",
    bg: "bg-orange-50",
    border: "border-orange-100",
  },
  {
    icon: Mic,
    title: "Luyện nói",
    desc: "Ghi âm → Deepgram nhận dạng tiếng Hàn → AI chấm phát âm & 말투",
    color: "from-purple-500 to-fuchsia-500",
    bg: "bg-purple-50",
    border: "border-purple-100",
  },
  {
    icon: Zap,
    title: "AI Grading",
    desc: "Groq LLaMA chấm điểm theo rubric TOPIK chính thức, phản hồi chi tiết",
    color: "from-yellow-400 to-amber-500",
    bg: "bg-yellow-50",
    border: "border-yellow-100",
  },
];

const topikLevels = [
  { level: "1", label: "Sơ cấp 1", color: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  { level: "2", label: "Sơ cấp 2", color: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50" },
  { level: "3", label: "Trung cấp 3", color: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
  { level: "4", label: "Trung cấp 4", color: "bg-orange-500", text: "text-orange-700", bg: "bg-orange-50" },
  { level: "5", label: "Cao cấp 5", color: "bg-red-500", text: "text-red-700", bg: "bg-red-50" },
  { level: "6", label: "Thành thạo 6", color: "bg-purple-500", text: "text-purple-700", bg: "bg-purple-50" },
];

const benefits = [
  "Lộ trình học từ 0 đến TOPIK 6",
  "AI chấm điểm chuẩn rubric TOPIK",
  "Deepgram nhận dạng tiếng Hàn chính xác",
  "Giao diện Duolingo-style, gamified",
  "Romanization toggle cho người mới",
  "Hoàn toàn miễn phí",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="container max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
              <span className="text-white text-base font-bold">韓</span>
            </div>
            <div className="leading-none">
              <p className="font-bold text-slate-900 text-sm">DingDong</p>
              <p className="text-xs text-slate-500 font-medium">Korean</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900" asChild>
              <Link href="/login">Đăng nhập</Link>
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30" asChild>
              <Link href="/register">Bắt đầu miễn phí</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background mesh */}
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-30"
          style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)" }} />

        <div className="relative container max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-sm text-blue-700 font-medium mb-8">
            <Star className="w-3.5 h-3.5 fill-blue-500" />
            TOPIK I + II • 6 kỹ năng • AI Grading
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-[1.1] tracking-tight">
            Học tiếng Hàn
            <br />
            <span className="gradient-text">chuẩn TOPIK</span>
          </h1>

          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Nền tảng học tiếng Hàn tích hợp dành cho người Việt — từ Hangul đến TOPIK 6,
            được chấm điểm bằng AI và Deepgram Speech-to-Text.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white h-13 px-8 text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all" asChild>
              <Link href="/register">
                Học miễn phí ngay
                <ArrowRight className="ml-1.5 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-13 px-8 text-base border-slate-200 text-slate-700 hover:bg-slate-50" asChild>
              <Link href="/login">Đăng nhập</Link>
            </Button>
          </div>

          {/* Hangul showcase */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {["안녕하세요", "감사합니다", "공부해요", "한국어"].map((word) => (
              <div key={word} className="bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-2xl font-bold text-slate-800 hangul-text">{word}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOPIK Levels */}
      <section className="py-16 px-4 bg-slate-50 border-y border-slate-100">
        <div className="container max-w-5xl mx-auto">
          <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">
            Lộ trình học từ sơ cấp đến thành thạo
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {topikLevels.map((l) => (
              <div key={l.level} className={`${l.bg} rounded-2xl p-4 text-center border border-slate-100`}>
                <div className={`w-8 h-8 ${l.color} rounded-xl mx-auto mb-2 flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">{l.level}</span>
                </div>
                <p className={`text-xs font-semibold ${l.text}`}>{l.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200 bg-blue-50">
              6 Kỹ năng tích hợp
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Học toàn diện, không bỏ sót</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Từ bảng chữ cái đến kỳ thi TOPIK — tất cả trong một nền tảng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div key={f.title} className={`group ${f.bg} ${f.border} border rounded-2xl p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-default`}>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-sm`}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="container max-w-4xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">Tại sao chọn DingDong Korean?</h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Được thiết kế riêng cho người Việt học tiếng Hàn —
                với lộ trình rõ ràng và công nghệ AI tiên tiến.
              </p>
            </div>
            <ul className="space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3 text-blue-50">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="font-medium">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center bg-mesh">
        <div className="container max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-900/5 p-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
              <span className="text-white text-2xl font-bold">韓</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Sẵn sàng bắt đầu?</h2>
            <p className="text-slate-500 mb-8 text-lg">
              Tạo tài khoản miễn phí và bắt đầu hành trình học tiếng Hàn hôm nay.
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-10 h-13 text-base shadow-lg shadow-blue-500/25" asChild>
              <Link href="/register">
                Đăng ký miễn phí
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <p className="text-sm text-slate-400 mt-4">Không cần thẻ tín dụng</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 px-4">
        <div className="container max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">韓</span>
            </div>
            <span className="text-sm font-semibold text-slate-700">DingDong Korean</span>
          </div>
          <p className="text-sm text-slate-400">© 2026 DingDong Korean. Made for Vietnamese Korean learners.</p>
          <div className="flex gap-4 text-sm text-slate-400">
            <Link href="/login" className="hover:text-slate-700 transition-colors">Đăng nhập</Link>
            <Link href="/register" className="hover:text-slate-700 transition-colors">Đăng ký</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
