import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { transcribeAudio } from "@/lib/deepgram";
import { gradeSpeaking } from "@/lib/claude";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const audioFile = formData.get("audio") as File | null;
  const setId = formData.get("setId") as string;
  const taskType = formData.get("taskType") as string;
  const level = formData.get("level") as string;
  const speechLevel = formData.get("speechLevel") as "FORMAL" | "POLITE" | "INFORMAL";

  if (!audioFile) return NextResponse.json({ error: "No audio" }, { status: 400 });

  const buffer = Buffer.from(await audioFile.arrayBuffer());
  const transcript = await transcribeAudio(buffer, audioFile.type);
  const feedback = await gradeSpeaking(transcript, level, speechLevel, taskType);

  await db.attempt.create({
    data: {
      userId: session.user.id,
      skill: "SPEAKING",
      refId: setId,
      rawAnswer: { transcript },
      score: feedback.score,
      feedback: JSON.parse(JSON.stringify(feedback)),
    },
  });

  return NextResponse.json({ feedback });
}
