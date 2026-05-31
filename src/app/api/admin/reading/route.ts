import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1),
  titleKo: z.string(),
  topikLevel: z.string(),
  passage: z.string().min(1),
  timeLimit: z.number(),
  questions: z.array(
    z.object({
      type: z.string(),
      prompt: z.string(),
      options: z.array(z.string()),
      correctAnswer: z.string(),
      explanation: z.string().optional(),
    })
  ),
});

async function requireAdmin() {
  const session = await auth();
  const user = (session?.user ?? {}) as { role?: string };
  if (!session?.user || user.role !== "ADMIN") return null;
  return session;
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const { questions, ...testData } = parsed.data;
  const test = await db.readingTest.create({
    data: {
      ...testData,
      topikLevel: testData.topikLevel as "TOPIK1" | "TOPIK2" | "TOPIK3" | "TOPIK4" | "TOPIK5" | "TOPIK6",
      questions: {
        create: questions.map((q, i) => ({
          type: q.type as "MCQ" | "FILL_BLANK" | "TRUE_FALSE" | "MATCHING" | "SHORT_ANSWER",
          prompt: q.prompt,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation ?? null,
          order: i,
        })),
      },
    },
  });

  return NextResponse.json({ id: test.id });
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tests = await db.readingTest.findMany({
    include: { questions: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tests);
}
