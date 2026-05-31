# DingDong Korean — Nền tảng học tiếng Hàn

> Full-stack web app học tiếng Hàn với các module: Từ vựng & Ngữ pháp TOPIK (Duolingo-style), Học Hangul, Đọc hiểu, Nghe hiểu, Viết luận, Luyện nói — được chấm điểm bằng Claude AI.

---

## 1. Mục tiêu sản phẩm

Một nền tảng học tiếng Hàn tích hợp giúp người học:
- Học **Hangul** từ đầu — bảng âm tương tác, nhận biết và viết chữ cái Hàn.
- Học **từ vựng & ngữ pháp** theo chuẩn TOPIK I (Level 1–2) và TOPIK II (Level 3–6) qua bài học ngắn, gamified (XP, streak, hearts, lessons unlock).
- Luyện **Đọc hiểu** với văn bản tiếng Hàn + câu hỏi (format đề TOPIK thật).
- Luyện **Nghe hiểu** với audio tiếng Hàn + câu hỏi (format TOPIK).
- Luyện **Viết** (TOPIK II Writing) — AI chấm ngữ pháp, từ vựng, cấu trúc bài, văn phong lịch sự/trang trọng.
- Luyện **Nói** (hội thoại, trình bày ý kiến, mô tả ảnh) — ghi âm browser → AI chấm Phát âm, Lưu loát, Ngữ pháp.

Giao diện: **chuyên nghiệp, tối giản, mobile-first**, responsive cho mọi breakpoint.

---

## 2. Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | **Next.js 15** (App Router) + TypeScript |
| Styling | Tailwind CSS + **shadcn/ui** (Radix primitives) |
| Icons | lucide-react |
| Animation | framer-motion (Duolingo-style feedback) |
| Database | **PostgreSQL** (Railway managed) |
| ORM | **Prisma** |
| Auth | **Auth.js (NextAuth v5)** — email/password + Google OAuth |
| AI Grading | **Anthropic Claude API** (`@anthropic-ai/sdk`, model `claude-sonnet-4-6`) |
| Speech-to-Text | **Deepgram API** (model `nova-2`, language `ko`) |
| Romanization | `korean-romanization` (Hangul → Revised Romanization) |
| File Storage | Railway volume hoặc Cloudflare R2 cho audio uploads |
| State | React Server Components + Zustand cho client UI state |
| Forms | react-hook-form + zod |
| Deployment | **Railway** (web + Postgres), **GitHub** (source + CI) |

**Lý do chọn Deepgram `ko`**: độ chính xác cao với tiếng Hàn chuẩn Seoul, nhận diện tốt cả 존댓말 lẫn 반말, latency thấp hơn Whisper.

---

## 3. Cấu trúc thư mục

```
dingdong-korean/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
│   ├── audio/                   # Listening files
│   └── images/
├── src/
│   ├── app/
│   │   ├── (marketing)/         # Landing page
│   │   ├── (auth)/              # login, register
│   │   ├── (learn)/
│   │   │   ├── dashboard/
│   │   │   ├── hangul/          # Học bảng chữ Hangul
│   │   │   ├── vocab/[unitId]/
│   │   │   ├── grammar/[unitId]/
│   │   │   ├── reading/[testId]/
│   │   │   ├── listening/[testId]/
│   │   │   ├── writing/[taskId]/
│   │   │   └── speaking/[setId]/
│   │   ├── admin/
│   │   │   ├── reading/
│   │   │   ├── listening/
│   │   │   ├── writing/
│   │   │   ├── speaking/
│   │   │   ├── vocab/
│   │   │   ├── grammar/
│   │   │   ├── hangul/
│   │   │   └── users/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── grade/writing/route.ts
│   │   │   ├── grade/speaking/route.ts
│   │   │   ├── transcribe/route.ts    # Deepgram ko
│   │   │   └── admin/.../route.ts
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── learn/               # LessonCard, HeartBar, XPBar, StreakFlame
│   │   ├── hangul/              # HangulGrid, HangulQuiz, JamoBreakdown
│   │   ├── admin/
│   │   └── shared/
│   ├── lib/
│   │   ├── db.ts
│   │   ├── auth.ts
│   │   ├── claude.ts            # Anthropic client + grading prompts tiếng Hàn
│   │   ├── deepgram.ts          # Speech-to-text ko
│   │   ├── romanization.ts      # Hangul → Revised Romanization utils
│   │   └── utils.ts
│   ├── server/
│   │   └── actions/
│   └── types/
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── package.json
├── railway.toml
└── README.md
```

---

## 4. Database Schema (Prisma)

```prisma
model User {
  id            String      @id @default(cuid())
  email         String      @unique
  name          String?
  passwordHash  String?
  role          Role        @default(LEARNER)
  xp            Int         @default(0)
  hearts        Int         @default(5)
  streakDays    Int         @default(0)
  topikLevel    TOPIKLevel  @default(TOPIK1)
  lastActiveAt  DateTime?
  createdAt     DateTime    @default(now())

  vocabProgress    VocabProgress[]
  grammarProgress  GrammarProgress[]
  hangulProgress   HangulProgress[]
  attempts         Attempt[]
}

model VocabUnit {
  id          String      @id @default(cuid())
  title       String
  titleKo     String      // VD: "일상 대화"
  topikLevel  TOPIKLevel
  order       Int
  lessons     VocabLesson[]
}

model VocabLesson {
  id        String      @id @default(cuid())
  unitId    String
  unit      VocabUnit   @relation(fields: [unitId], references: [id])
  order     Int
  exercises Json        // [{ type: "match" | "translate" | "listen" | "fillBlank" | "speechLevel" | "sentenceOrder", ... }]
}

model HangulSet {
  id          String      @id @default(cuid())
  type        HangulType  // JAMO_BASIC | JAMO_COMPOUND | SYLLABLE_BLOCK
  category    String      // "모음 (Vowel)" | "자음 (Consonant)" | "받침 (Batchim)"
  characters  Json        // [{ hangul: "가", romaji: "ga", example: "가방" }]
}

model GrammarUnit {
  id          String      @id @default(cuid())
  title       String
  titleKo     String
  topikLevel  TOPIKLevel
  pattern     String      // VD: "-(으)면"
  explanation String      @db.Text
  order       Int
  lessons     GrammarLesson[]
}

model GrammarLesson {
  id        String        @id @default(cuid())
  unitId    String
  unit      GrammarUnit   @relation(fields: [unitId], references: [id])
  order     Int
  exercises Json          // fill-blank, transform, speech-level-convert
}

model ReadingTest {
  id          String      @id @default(cuid())
  title       String
  titleKo     String
  topikLevel  TOPIKLevel
  passage     String      @db.Text    // văn bản tiếng Hàn
  timeLimit   Int
  questions   Question[]
  createdAt   DateTime    @default(now())
}

model ListeningTest {
  id          String      @id @default(cuid())
  title       String
  topikLevel  TOPIKLevel
  audioUrl    String
  transcript  String?     @db.Text
  questions   Question[]
}

model Question {
  id            String       @id @default(cuid())
  type          QuestionType // MCQ | FILL_BLANK | TRUE_FALSE | MATCHING | SHORT_ANSWER
  prompt        String       @db.Text
  options       Json?
  correctAnswer Json
  readingId     String?
  listeningId   String?
}

model WritingTask {
  id            String          @id @default(cuid())
  taskType      WritingTaskType // TOPIK_51 | TOPIK_52 | TOPIK_53 | FREE
  prompt        String          @db.Text
  promptKo      String?         @db.Text
  imageUrl      String?
  minChars      Int
  timeLimit     Int
  topikLevel    TOPIKLevel
  requireFormal Boolean         @default(false)  // yêu cầu 격식체 (formal) không
}

model SpeakingSet {
  id              String          @id @default(cuid())
  topikLevel      TOPIKLevel
  taskType        SpeakingTaskType // CONVERSATION | PICTURE_DESC | OPINION | ROLEPLAY
  topic           String
  topicKo         String
  prompts         Json
  speechLevel     SpeechLevel     @default(FORMAL)  // FORMAL(합쇼체) | POLITE(해요체) | INFORMAL(반말)
  prepTimeSec     Int             @default(30)
  speakTimeSec    Int             @default(90)
}

model Attempt {
  id            String      @id @default(cuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  skill         Skill       // READING | LISTENING | WRITING | SPEAKING | VOCAB | GRAMMAR | HANGUL
  refId         String
  rawAnswer     Json
  score         Float?      // TOPIK Writing: 0–200 (scaled); Reading/Listening: % đúng
  feedback      Json?
  durationSec   Int?
  createdAt     DateTime    @default(now())
}

enum Role          { LEARNER ADMIN }
enum TOPIKLevel    { TOPIK1 TOPIK2 TOPIK3 TOPIK4 TOPIK5 TOPIK6 }
enum HangulType    { JAMO_BASIC JAMO_COMPOUND SYLLABLE_BLOCK }
enum SpeechLevel   { FORMAL POLITE INFORMAL }
enum Skill         { READING LISTENING WRITING SPEAKING VOCAB GRAMMAR HANGUL }
enum QuestionType  { MCQ FILL_BLANK TRUE_FALSE MATCHING SHORT_ANSWER }
enum WritingTaskType { TOPIK_51 TOPIK_52 TOPIK_53 FREE }
enum SpeakingTaskType { CONVERSATION PICTURE_DESC OPINION ROLEPLAY }
```

---

## 5. Features chi tiết

### 5.1 Hangul (한글)
- **Jamo breakdown**: giải thích cấu tạo âm tiết = 초성 (Initial) + 중성 (Vowel) + 받침 (Final).
- **Bảng âm tương tác**: click ký tự → nghe phát âm + xem khẩu hình.
- **Syllable builder**: kéo thả jamo để ghép thành âm tiết, realtime preview.
- **Quiz mode**: nghe âm → chọn Hangul; hoặc xem Hangul → gõ Romanization.
- **Batchim rules**: quy tắc biến âm khi có batchim — modal giải thích kèm ví dụ âm thanh.
- Progress theo nhóm (모음, 자음, 받침).

### 5.2 Vocabulary & Grammar (Duolingo-style)
- **Unit → Lesson → Exercise** theo TOPIK level.
- Exercise types:
  - **match**: nối từ Hàn ↔ nghĩa Việt
  - **translate**: dịch câu
  - **listen**: nghe → chọn/gõ từ
  - **fillBlank**: điền vào chỗ trống (grammar pattern)
  - **speechLevel**: chuyển đổi 반말 ↔ 존댓말
  - **sentenceOrder**: sắp xếp từ thành câu đúng
  - **conjugation**: chia động từ theo thì / thể kính ngữ
- **Romanization toggle**: hover/tap từ → hiện Revised Romanization.
- Hearts + XP + Streak animation.

### 5.3 Reading
- Passage với **Romanization toggle** (ẩn mặc định ở TOPIK 3+).
- **Click-to-lookup**: click từ → popup nghĩa + từ loại + ví dụ + speech level.
- **Grammar highlight**: gạch chân pattern ngữ pháp đã học.
- Timer format TOPIK thật.
- Submit → auto-grade + giải thích đáp án.

### 5.4 Listening
- Audio player, speed control 0.75x–1.5x.
- Format TOPIK: hội thoại ngắn (Part 1) và monologue/hội thoại dài (Part 2).
- Transcript ẩn đến khi submit.
- Admin upload audio + transcript + questions.

### 5.5 Writing (TOPIK II)
- **TOPIK Task 51**: điền vào đoạn văn (fill-in-the-blank paragraph) — 2 chỗ trống.
- **TOPIK Task 52**: viết đoạn văn ngắn dựa trên gợi ý.
- **TOPIK Task 53**: viết luận dài (600–700 ký tự) về chủ đề xã hội — **task quan trọng nhất**.
- **FREE**: viết tự do.
- Editor: ký tự counter Hangul realtime, autosave.
- Submit → Claude chấm:
  - **Nội dung** (내용): đáp ứng yêu cầu đề bài, đủ ý.
  - **Ngữ pháp** (문법): chia động từ, cấu trúc câu, kết nối mệnh đề.
  - **Từ vựng** (어휘): đa dạng, phù hợp văn cảnh, tránh lặp từ.
  - **Văn phong** (격식): có dùng đúng formal style 합쇼체 không (TOPIK yêu cầu).

### 5.6 Speaking
- **CONVERSATION**: hội thoại hàng ngày (자기소개, 날씨, 취미...).
- **PICTURE_DESC**: mô tả bức tranh/ảnh bằng tiếng Hàn.
- **OPINION**: trình bày ý kiến về chủ đề xã hội.
- **ROLEPLAY**: nhập vai tình huống (식당, 병원, 쇼핑...).
- MediaRecorder → Deepgram `ko` → Claude grade.
- Output:
  - **Phát âm** (발음): âm đặc trưng Hàn (ㅡ, ㅓ, ㅏ, tense consonants ㄲ/ㄸ/ㅃ).
  - **Speech level** (말투): dùng đúng 존댓말/반말 theo tình huống.
  - **Ngữ pháp nói** (문법): chia đuôi câu, kết nối.
  - **Lưu loát** (유창성): tốc độ, filler (어, 음), độ tự nhiên.

### 5.7 Admin Dashboard
- CRUD: Reading, Listening, Writing, Speaking, Vocab, Grammar, Hangul sets.
- **TOPIK level filter**: quản lý content theo TOPIK I / II và từng level.
- Upload audio + transcript.
- User management: xem list, set TOPIK target, reset hearts.

---

## 6. AI Grading Prompts

Template trong [src/lib/claude.ts](src/lib/claude.ts):

**Writing system prompt**:
```
You are a certified TOPIK (Test of Proficiency in Korean) examiner.
Evaluate the following Korean writing by a Vietnamese learner at TOPIK Level {level}.
{requireFormal ? "This task requires formal written Korean (합쇼체/격식체). Evaluate formality separately." : ""}
Note: The learner's native language is Vietnamese.
Return structured JSON only.
```

**Speaking system prompt**:
```
You are a Korean language speaking coach specializing in TOPIK preparation.
Evaluate this transcript of a Vietnamese learner speaking Korean at TOPIK Level {level}.
Expected speech level: {speechLevel} ({speechLevel === 'FORMAL' ? '합쇼체' : speechLevel === 'POLITE' ? '해요체' : '반말'}).
Note: The learner's native language is Vietnamese — common errors include ㅡ/ㅓ confusion and missing batchim.
Return structured JSON only.
```

- Model: `claude-sonnet-4-6` (writing/speaking), `claude-haiku-4-5` (vocab feedback).
- **Prompt caching** cho system prompt + rubric.
- Temperature: 0.3.

Output schema Writing (TOPIK 53):
```json
{
  "score": 38,
  "maxScore": 50,
  "criteria": {
    "content":    { "score": 9,  "maxScore": 12, "feedback": "..." },
    "grammar":    { "score": 10, "maxScore": 14, "feedback": "...", "errors": ["..."] },
    "vocabulary": { "score": 10, "maxScore": 14, "feedback": "...", "suggestions": ["..."] },
    "formality":  { "score": 9,  "maxScore": 10, "feedback": "..." }
  },
  "annotations": [
    { "original": "...", "issue": "...", "correction": "...", "explanation": "..." }
  ],
  "correctedVersion": "..."
}
```

Output schema Speaking:
```json
{
  "score": 74,
  "criteria": {
    "pronunciation": { "score": 70, "errors": [{ "word": "...", "issue": "..." }] },
    "speechLevel":   { "score": 80, "expected": "해요체", "errors": ["..."] },
    "grammar":       { "score": 72, "errors": ["..."] },
    "fluency":       { "score": 78, "wordsPerMinute": 110, "fillerCount": 4, "feedback": "..." }
  },
  "transcript": "...",
  "overallFeedback": "..."
}
```

---

## 7. UI/UX Guidelines

- **Color palette**: primary blue-600 (màu Taegeukgi), red-500 cho accent, success green-500, neutral zinc.
- **Typography**:
  - UI latin: Inter
  - Tiếng Hàn: `Noto Sans KR` (Google Fonts, `font-display: swap`)
- **Romanization display**: nhỏ hơn, màu neutral-400, hiển thị dưới từ Hàn.
- **Spacing**: Tailwind 4/8 scale.
- **Mobile-first**: test 375px.
- **TOPIK level badges**: 
  - TOPIK I: Level 1=xanh lá, Level 2=xanh dương
  - TOPIK II: Level 3=vàng, Level 4=cam, Level 5=đỏ, Level 6=tím
- **Speech level indicator**: chip nhỏ hiển thị 합쇼체 / 해요체 / 반말 trên mỗi bài.
- **Loading**: skeleton. **Toasts**: sonner.

shadcn/ui bắt buộc: Button, Card, Dialog, Input, Textarea, Select, Toast, Tabs, Progress, Badge, Sheet.

---

## 8. Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/dingdong_korean"

# Auth
AUTH_SECRET=""
AUTH_TRUST_HOST="true"
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""

# Anthropic
ANTHROPIC_API_KEY=""

# Deepgram (Speech-to-Text tiếng Hàn)
DEEPGRAM_API_KEY=""

# Storage
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET=""

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

---

## 9. Deployment — Railway + GitHub

### 9.1 `railway.toml`
```toml
[build]
builder = "NIXPACKS"
buildCommand = "npm install && npx prisma generate && npx prisma migrate deploy && npm run build"

[deploy]
startCommand = "npm start"
healthcheckPath = "/api/health"
restartPolicyType = "ON_FAILURE"
```

### 9.2 CI
- `.github/workflows/ci.yml`: lint + typecheck + prisma validate.
- Auto deploy khi push `main`.

---

## 10. Development Commands

```bash
npm install
cp .env.example .env.local
npx prisma migrate dev
npx prisma db seed              # seed Hangul tables + TOPIK 1 vocab (800 từ) + 2 reading tests

npm run dev                     # http://localhost:3000
npm run typecheck
npm run lint
npm run build && npm start

npx prisma studio
npx prisma migrate dev --name <change>
```

---

## 11. Roadmap thứ tự build

1. **Skeleton**: Next.js + TS + Tailwind + shadcn + Prisma + Auth.js.
2. **Auth**: email + Google login.
3. **DB schema + migrations**: seed Hangul (자모 + âm tiết mẫu) + TOPIK 1 vocab (800 từ).
4. **Learner dashboard**: XP, streak, hearts, TOPIK target, module list.
5. **Hangul module**: jamo bảng tương tác + syllable builder + quiz.
6. **Vocab & Grammar Duolingo-style**: speech level exercises + conjugation.
7. **Reading module**: passage + romanization toggle + click-to-lookup + grammar highlight.
8. **Listening module**: audio player + questions TOPIK format.
9. **Writing module + AI grading**: TOPIK 51/52/53 editor + formality checker + Claude.
10. **Speaking module + AI grading**: recorder + Deepgram ko + Claude (speech level check).
11. **Admin dashboard**: CRUD + TOPIK level filter.
12. **Polish**: animations, mobile QA, speech level indicator.
13. **Deploy**: Railway live + custom domain.

---

## 12. Coding Conventions

- **TypeScript strict**: không `any`, dùng `unknown` + type guard.
- **Server Actions** ưu tiên hơn API routes cho mutations.
- **Validation**: zod ở mọi boundary.
- **Error handling**: `{ ok, error }` + `toast.error()`.
- **File limits**: 1 component/file, >300 dòng thì tách.
- **Naming**: PascalCase components, camelCase utils, kebab-case routes.
- **Imports**: `@/` alias.
- **Encoding**: UTF-8 toàn bộ.
- Không tự ý thêm lib mới — hỏi trước.
- Không commit secrets.
- Migration mới cho mỗi schema change.
- **Test trước khi báo done**: `npm run typecheck && npm run build`.

---

## 13. Đặc thù tiếng Hàn — lưu ý khi code

- **Hangul là alphabet** (không phải ideograph như Kanji/Hán tự) — mỗi ký tự là 1 âm tiết ghép từ jamo. Không cần stroke order animation.
- **Batchim (받침)**: phụ âm cuối ảnh hưởng phát âm từ tiếp theo (연음, 비음화, 격음화, 경음화) — khi chấm speaking, Claude prompt phải biết rule này.
- **Speech levels (말투)** — 3 level chính cần dạy:
  - 합쇼체 (haeyoche formal): văn viết, báo chí, TOPIK Writing.
  - 해요체 (haeyoche polite): giao tiếp hàng ngày lịch sự — **default cho speaking**.
  - 반말 (banmal): nói chuyện bạn bè — dạy ở level cao, luôn ghi rõ context.
- **IME support**: handle `compositionstart/end` — không fire `onChange` khi đang gõ Hangul IME.
- **Ký tự counter**: đếm bằng `[...text].filter(c => /[가-힣]/.test(c)).length` để chỉ đếm âm tiết Hangul hoàn chỉnh.
- **Romanization**: dùng Revised Romanization of Korean (국립국어원 표준) — không dùng McCune-Reischauer.
- **Particle thay đổi**: 은/는, 이/가, 을/를, 은/는 — thay đổi theo batchim của từ trước. Khi tạo exercise, auto-detect và chọn đúng.
- **Deepgram `ko`**: tốt với Seoul dialect (표준어). Nếu có Busan/Jeju dialect → disclaimer.
- **SpeechLevel trong Claude**: luôn specify kỳ vọng level trong prompt, VD: "Expected: 해요체. Flag bất kỳ 반말 ending nào như 야/이야/해/어."

---

## 14. Khi user yêu cầu thay đổi

- Thay đổi nhỏ (style, copy): làm trực tiếp.
- Feature mới / thay schema: plan ngắn → xác nhận → làm.
- Bug AI grading: kiểm tra prompt + log raw Claude response trước.
- User paste token: **không** echo lại, confirm "đã nhận" + lưu `.env.local`.

---

## 15. Liên hệ & ghi chú

- Owner: dingdong1405edu@gmail.com
- Tokens cần thiết: `ANTHROPIC_API_KEY`, `DEEPGRAM_API_KEY`, `RAILWAY_TOKEN`, `GITHUB_TOKEN`.
- Mọi quyết định kiến trúc lớn → hỏi user trước.
