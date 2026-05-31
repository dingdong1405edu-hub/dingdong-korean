"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addXP(amount: number) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  await db.user.update({
    where: { id: session.user.id },
    data: {
      xp: { increment: amount },
      lastActiveAt: new Date(),
    },
  });

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function loseHeart() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const user = await db.user.findUnique({ where: { id: session.user.id }, select: { hearts: true } });
  if (!user || user.hearts <= 0) return { ok: true, hearts: 0 };

  const updated = await db.user.update({
    where: { id: session.user.id },
    data: { hearts: { decrement: 1 } },
    select: { hearts: true },
  });

  return { ok: true, hearts: updated.hearts };
}

export async function refillHearts() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  await db.user.update({
    where: { id: session.user.id },
    data: { hearts: 5 },
  });

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateStreak() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { lastActiveAt: true, streakDays: true },
  });

  if (!user) return { error: "User not found" };

  const now = new Date();
  const last = user.lastActiveAt;
  let newStreak = user.streakDays;

  if (last) {
    const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) newStreak += 1;
    else if (diffDays > 1) newStreak = 1;
  } else {
    newStreak = 1;
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { streakDays: newStreak, lastActiveAt: now },
  });

  return { ok: true, streak: newStreak };
}
