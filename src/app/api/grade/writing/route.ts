import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { gradeWriting } from "@/lib/claude";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  text: z.string().min(1),
  taskId: z.string(),
  taskType: z.string(),
  level: z.string(),
  requireFormal: z.boolean(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { text, taskId, taskType, level, requireFormal } = parsed.data;

  const feedback = await gradeWriting(text, level, taskType, requireFormal);

  await db.attempt.create({
    data: {
      userId: session.user.id,
      skill: "WRITING",
      refId: taskId,
      rawAnswer: { text },
      score: feedback.score,
      feedback: JSON.parse(JSON.stringify(feedback)),
    },
  });

  return NextResponse.json({ feedback });
}
