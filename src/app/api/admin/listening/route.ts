import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1),
  topikLevel: z.enum(["TOPIK1","TOPIK2","TOPIK3","TOPIK4","TOPIK5","TOPIK6"]),
  audioUrl: z.string().url(),
  transcript: z.string().optional(),
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
  return user?.role === "ADMIN" ? session : null;
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const { questions, ...testData } = parsed.data;
  const test = await db.listeningTest.create({
    data: {
      ...testData,
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
