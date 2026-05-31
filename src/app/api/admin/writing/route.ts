import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  taskType: z.enum(["TOPIK_51", "TOPIK_52", "TOPIK_53", "FREE"]),
  prompt: z.string().min(1),
  promptKo: z.string().optional(),
  minChars: z.number(),
  timeLimit: z.number(),
  topikLevel: z.enum(["TOPIK1","TOPIK2","TOPIK3","TOPIK4","TOPIK5","TOPIK6"]),
  requireFormal: z.boolean(),
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

  const task = await db.writingTask.create({ data: parsed.data });
  return NextResponse.json({ id: task.id });
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tasks = await db.writingTask.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(tasks);
}
