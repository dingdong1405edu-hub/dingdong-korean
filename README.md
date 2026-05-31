# DingDong Korean 🔔

Nền tảng học tiếng Hàn tích hợp cho người Việt — TOPIK I + II, 6 kỹ năng, AI grading.

## Setup nhanh

```bash
# 1. Cài dependencies
npm install

# 2. Tạo .env.local từ template
cp .env.example .env.local
# Điền DATABASE_URL, AUTH_SECRET, GROQ_API_KEY, DEEPGRAM_API_KEY

# 3. Tạo DB + migrate
npx prisma migrate dev

# 4. Seed data (Hangul sets, 800+ TOPIK 1 vocab, reading tests)
npm run db:seed

# 5. Chạy dev server
npm run dev
```

## Modules
- `/hangul` — Học bảng chữ Hangul (자모, 모음, 자음, 받침)
- `/vocab` — Từ vựng TOPIK I Duolingo-style (10 chủ đề, 200+ từ)
- `/grammar` — Ngữ pháp patterns (10 patterns TOPIK I–II)
- `/reading` — Đọc hiểu chuẩn TOPIK + romanization toggle
- `/listening` — Nghe hiểu audio player + speed control
- `/writing` — TOPIK 51/52/53 + Claude AI grading
- `/speaking` — Deepgram transcription + Claude grading
- `/admin` — Quản lý toàn bộ nội dung

## Tech Stack
Next.js 15 · TypeScript · Tailwind CSS · Prisma · PostgreSQL · Auth.js · Anthropic Claude · Deepgram
