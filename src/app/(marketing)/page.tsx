import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: "🔤", title: "Hangul", desc: "Học bảng chữ cái Hàn từ cơ bản đến nâng cao" },
  { icon: "📚", title: "Từ vựng & Ngữ pháp", desc: "TOPIK I–VI theo phong cách Duolingo gamified" },
  { icon: "📖", title: "Đọc hiểu", desc: "Bài đọc chuẩn TOPIK với click-to-lookup" },
  { icon: "🎧", title: "Nghe hiểu", desc: "Audio hội thoại chuẩn Seoul dialect" },
  { icon: "✍️", title: "Viết luận", desc: "AI chấm TOPIK Writing chuẩn rubric chính thức" },
  { icon: "🎤", title: "Luyện nói", desc: "Deepgram nhận diện tiếng Hàn + AI đánh giá" },
];

const topikLevels = [
  { level: "1", color: "bg-green-500", label: "Beginner" },
  { level: "2", color: "bg-blue-500", label: "Elementary" },
  { level: "3", color: "bg-yellow-500", label: "Intermediate" },
  { level: "4", color: "bg-orange-500", label: "Upper-Int" },
  { level: "5", color: "bg-red-500", label: "Advanced" },
  { level: "6", color: "bg-purple-500", label: "Mastery" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-2xl">🔔</span>
            <span>DingDong Korean</span>
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Đăng nhập</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Bắt đầu miễn phí</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-24 px-4">
        <div className="container text-center max-w-4xl">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">
            TOPIK I + II • 6 Kỹ năng • AI Grading
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Học tiếng Hàn<br />
            <span className="text-yellow-300">chuẩn TOPIK</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Nền tảng học tiếng Hàn tích hợp dành cho người Việt — từ Hangul đến TOPIK 6,
            được chấm điểm bằng Claude AI và Deepgram Speech-to-Text.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8" asChild>
              <Link href="/register">Học miễn phí ngay</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8" asChild>
              <Link href="/login">Đăng nhập</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* TOPIK Levels */}
      <section className="py-12 bg-zinc-50">
        <div className="container">
          <h2 className="text-center text-lg font-semibold text-muted-foreground mb-6">
            Lộ trình từ sơ cấp đến thành thạo
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {topikLevels.map((l) => (
              <div key={l.level} className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border">
                <span className={`w-3 h-3 rounded-full ${l.color}`} />
                <span className="font-semibold">Level {l.level}</span>
                <span className="text-muted-foreground text-sm">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-4">6 kỹ năng học tích hợp</h2>
          <p className="text-center text-muted-foreground mb-12">
            Học toàn diện — không chỉ từ vựng mà còn nghe, nói, đọc, viết chuẩn TOPIK
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">{f.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 text-white text-center px-4">
        <h2 className="text-3xl font-bold mb-4">Sẵn sàng bắt đầu?</h2>
        <p className="text-blue-100 mb-8 text-lg">Tạo tài khoản miễn phí và bắt đầu học tiếng Hàn hôm nay.</p>
        <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-10" asChild>
          <Link href="/register">Đăng ký miễn phí</Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-muted-foreground text-sm">
        <p>© 2026 DingDong Korean. Made with ❤️ for Vietnamese Korean learners.</p>
      </footer>
    </div>
  );
}
