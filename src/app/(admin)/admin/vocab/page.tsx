import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TOPIK_LEVEL_LABELS, TOPIK_LEVEL_COLORS } from "@/lib/utils";
import { Plus, Pencil } from "lucide-react";

export default async function AdminVocabPage() {
  const units = await db.vocabUnit.findMany({
    orderBy: [{ topikLevel: "asc" }, { order: "asc" }],
    include: { _count: { select: { lessons: true } } },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Vocab Units</h1>
        <Button asChild>
          <Link href="/admin/vocab/new"><Plus className="h-4 w-4 mr-1" /> New Unit</Link>
        </Button>
      </div>
      <div className="space-y-2">
        {units.map((unit) => (
          <Card key={unit.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={TOPIK_LEVEL_COLORS[unit.topikLevel]}>{TOPIK_LEVEL_LABELS[unit.topikLevel]}</Badge>
                  <span className="text-xs text-muted-foreground">Order {unit.order}</span>
                </div>
                <p className="font-medium">{unit.title}</p>
                <p className="text-sm text-muted-foreground hangul-text">{unit.titleKo}</p>
                <p className="text-xs text-muted-foreground">{unit._count.lessons} lessons</p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/admin/vocab/${unit.id}`}><Pencil className="h-3 w-3 mr-1" /> Edit</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
