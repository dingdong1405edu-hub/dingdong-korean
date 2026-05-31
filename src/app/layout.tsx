import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "DingDong Korean — Học Tiếng Hàn",
  description:
    "Nền tảng học tiếng Hàn tích hợp: Hangul, TOPIK vocab/grammar, Reading, Listening, Writing, Speaking — chấm điểm bằng AI.",
  keywords: ["tiếng hàn", "học tiếng hàn", "TOPIK", "hangul", "korean"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
