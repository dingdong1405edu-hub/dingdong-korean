import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VocabLesson } from "@/components/learn/VocabLesson";
import { TOPIK_LEVEL_LABELS, TOPIK_LEVEL_COLORS } from "@/lib/utils";

export default async function GrammarUnitPage({ params }: { params: Promise<{ unitId: string }> }) {
  const { unitId } = await params;
  const unit = await db.grammarUnit.findUnique({
    where: { id: unitId },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!unit) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge className={TOPIK_LEVEL_COLORS[unit.topikLevel]}>{TOPIK_LEVEL_LABELS[unit.topikLevel]}</Badge>
          <Badge variant="secondary" className="font-mono">{unit.pattern}</Badge>
        </div>
        <h1 className="text-2xl font-bold">{unit.title}</h1>
        <p className="text-muted-foreground hangul-text">{unit.titleKo}</p>
      </div>

      {/* Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Giải thích ngữ pháp</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{unit.explanation}</p>
        </CardContent>
      </Card>

      {/* Practice */}
      <div>
        <h2 className="font-semibold mb-3">Luyện tập</h2>
        <VocabLesson unit={{ id: unit.id, title: unit.title, titleKo: unit.titleKo, lessons: unit.lessons }} />
      </div>
    </div>
  );
}
