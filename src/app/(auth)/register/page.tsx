"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, User, Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(2, "Tên ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

const perks = [
  "Học Hangul từ đầu — miễn phí",
  "800+ từ vựng TOPIK I Duolingo-style",
  "AI chấm Writing & Speaking chuẩn TOPIK",
  "Deepgram nhận dạng giọng nói tiếng Hàn",
  "Không giới hạn bài học",
];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
    });

    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error || "Đăng ký thất bại");
    } else {
      toast.success("Đăng ký thành công! Đang đăng nhập...");
      router.push("/login");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <span className="text-white font-bold text-sm">韓</span>
            </div>
            <span className="font-bold text-slate-900">DingDong Korean</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-1">Tạo tài khoản</h1>
          <p className="text-slate-500 mb-8">Hoàn toàn miễn phí, không cần thẻ tín dụng</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">Họ tên</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="name"
                  placeholder="Nguyễn Văn A"
                  className="pl-9 h-11 border-slate-200 focus:border-blue-500"
                  {...register("name")}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-9 h-11 border-slate-200 focus:border-blue-500"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">Mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Ít nhất 6 ký tự"
                  className="pl-9 h-11 border-slate-200 focus:border-blue-500"
                  {...register("password")}
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">Xác nhận mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  className="pl-9 h-11 border-slate-200 focus:border-blue-500"
                  {...register("confirmPassword")}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm shadow-blue-500/20 mt-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              Tạo tài khoản
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>

      {/* Right panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-700 to-blue-800">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

        <div className="relative flex flex-col justify-center px-16 text-white">
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Bắt đầu hành trình<br />tiếng Hàn ngay!
          </h2>
          <p className="text-blue-100 text-lg mb-12 leading-relaxed">
            Từ Hangul đến TOPIK 6 — tất cả trong một nền tảng.
          </p>

          <div className="space-y-3">
            {perks.map((p) => (
              <div key={p} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                </div>
                <span className="text-blue-50 font-medium">{p}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <p className="text-2xl font-bold hangul-text mb-1">화이팅! 🎉</p>
            <p className="text-blue-200">Bạn có thể làm được!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
