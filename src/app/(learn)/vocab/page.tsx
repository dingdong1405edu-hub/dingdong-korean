import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TOPIK_LEVEL_LABELS, TOPIK_LEVEL_COLORS } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { Lock, CheckCircle2, BookMarked } from "lucide-react";

export default async function VocabPage() {
  const session = await auth();
  const units = await db.vocabUnit.findMany({
    orderBy: [{ topikLevel: "asc" }, { order: "asc" }],
    include: {
      lessons: { select: { id: true } },
      progress: {
        where: { userId: session!.user!.id },
      },
    },
  });

  const groupedByLevel = units.reduce(
    (acc, unit) => {
      if (!acc[unit.topikLevel]) acc[unit.topikLevel] = [];
      acc[unit.topikLevel].push(unit);
      return acc;
    },
    {} as Record<string, typeof units>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">어휘 — Từ vựng TOPIK</h1>
        <p className="text-muted-foreground mt-1">Học từ vựng theo chủ đề, chuẩn TOPIK I–II</p>
      </div>

      {Object.entries(groupedByLevel).map(([level, levelUnits]) => (
        <div key={level}>
          <div className="flex items-center gap-2 mb-4">
            <Badge className={TOPIK_LEVEL_COLORS[level]}>{TOPIK_LEVEL_LABELS[level]}</Badge>
          </div>
          <div className="space-y-3">
            {levelUnits.map((unit, idx) => {
              const isUnlocked = idx === 0 || levelUnits[idx - 1]?.progress[0]?.completed;
              const progress = unit.progress[0];
              const progressPct = progress?.completed ? 100 : 0;

              return (
                <Link
                  key={unit.id}
                  href={isUnlocked ? `/vocab/${unit.id}` : "#"}
                  className={isUnlocked ? "" : "pointer-events-none opacity-60"}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`p-3 rounded-full ${progress?.completed ? "bg-green-100" : "bg-blue-100"}`}>
                        {progress?.completed ? (
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        ) : isUnlocked ? (
                          <BookMarked className="h-6 w-6 text-blue-600" />
                        ) : (
                          <Lock className="h-6 w-6 text-zinc-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold">{unit.title}</p>
                        <p className="text-sm text-muted-foreground hangul-text">{unit.titleKo}</p>
                        <div className="mt-2">
                          <Progress value={progressPct} className="h-1.5" />
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{unit.lessons.length} bài</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
