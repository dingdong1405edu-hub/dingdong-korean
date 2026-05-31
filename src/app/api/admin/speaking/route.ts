import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  topikLevel: z.enum(["TOPIK1","TOPIK2","TOPIK3","TOPIK4","TOPIK5","TOPIK6"]),
  taskType: z.enum(["CONVERSATION","PICTURE_DESC","OPINION","ROLEPLAY"]),
  topic: z.string().min(1),
  topicKo: z.string(),
  prompts: z.array(z.string()),
  speechLevel: z.enum(["FORMAL","POLITE","INFORMAL"]).default("POLITE"),
  prepTimeSec: z.number().default(30),
  speakTimeSec: z.number().default(90),
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

  const set = await db.speakingSet.create({ data: parsed.data });
  return NextResponse.json({ id: set.id });
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sets = await db.speakingSet.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(sets);
}
