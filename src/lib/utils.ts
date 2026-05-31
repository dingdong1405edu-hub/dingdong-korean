import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return xp.toString();
}

export function xpForNextLevel(currentXP: number): { current: number; next: number; progress: number } {
  const levels = [0, 100, 250, 500, 1000, 2000, 3500, 5000, 7500, 10000];
  let levelIdx = 0;
  for (let i = 0; i < levels.length - 1; i++) {
    if (currentXP >= levels[i]) levelIdx = i;
  }
  const current = levels[levelIdx];
  const next = levels[Math.min(levelIdx + 1, levels.length - 1)];
  const progress = next === current ? 100 : Math.round(((currentXP - current) / (next - current)) * 100);
  return { current, next, progress };
}

export const TOPIK_LEVEL_LABELS: Record<string, string> = {
  TOPIK1: "TOPIK I — Level 1",
  TOPIK2: "TOPIK I — Level 2",
  TOPIK3: "TOPIK II — Level 3",
  TOPIK4: "TOPIK II — Level 4",
  TOPIK5: "TOPIK II — Level 5",
  TOPIK6: "TOPIK II — Level 6",
};

export const TOPIK_LEVEL_COLORS: Record<string, string> = {
  TOPIK1: "bg-green-100 text-green-800 border-green-200",
  TOPIK2: "bg-blue-100 text-blue-800 border-blue-200",
  TOPIK3: "bg-yellow-100 text-yellow-800 border-yellow-200",
  TOPIK4: "bg-orange-100 text-orange-800 border-orange-200",
  TOPIK5: "bg-red-100 text-red-800 border-red-200",
  TOPIK6: "bg-purple-100 text-purple-800 border-purple-200",
};

export const SPEECH_LEVEL_LABELS: Record<string, string> = {
  FORMAL: "합쇼체",
  POLITE: "해요체",
  INFORMAL: "반말",
};

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function selectParticle(word: string, withBatchim: string, withoutBatchim: string): string {
  if (!word) return withoutBatchim;
  const lastChar = word[word.length - 1];
  const code = lastChar.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return withoutBatchim;
  const hasBatchim = (code - 0xac00) % 28 !== 0;
  return hasBatchim ? withBatchim : withoutBatchim;
}
