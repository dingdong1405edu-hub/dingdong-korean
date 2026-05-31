import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { transcribeAudio } from "@/lib/deepgram";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const audioFile = formData.get("audio") as File | null;
  if (!audioFile) return NextResponse.json({ error: "No audio" }, { status: 400 });

  const buffer = Buffer.from(await audioFile.arrayBuffer());
  const transcript = await transcribeAudio(buffer, audioFile.type);

  return NextResponse.json({ transcript });
}
