import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TOPIK_LEVEL_LABELS, TOPIK_LEVEL_COLORS } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { ChevronRight } from "lucide-react";

export default async function GrammarPage() {
  const session = await auth();
  const units = await db.grammarUnit.findMany({
    orderBy: [{ topikLevel: "asc" }, { order: "asc" }],
    include: {
      lessons: { select: { id: true } },
      progress: { where: { userId: session!.user!.id } },
    },
  });

  const grouped = units.reduce(
    (acc, u) => {
      if (!acc[u.topikLevel]) acc[u.topikLevel] = [];
      acc[u.topikLevel].push(u);
      return acc;
    },
    {} as Record<string, typeof units>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">문법 — Ngữ pháp TOPIK</h1>
        <p className="text-muted-foreground mt-1">Học pattern ngữ pháp theo chuẩn TOPIK I–II</p>
      </div>

      {Object.entries(grouped).map(([level, levelUnits]) => (
        <div key={level}>
          <Badge className={`mb-4 ${TOPIK_LEVEL_COLORS[level]}`}>{TOPIK_LEVEL_LABELS[level]}</Badge>
          <div className="space-y-3">
            {levelUnits.map((unit) => (
              <Link key={unit.id} href={`/grammar/${unit.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="font-mono text-sm">
                          {unit.pattern}
                        </Badge>
                      </div>
                      <p className="font-semibold">{unit.title}</p>
                      <p className="text-sm text-muted-foreground hangul-text">{unit.titleKo}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
