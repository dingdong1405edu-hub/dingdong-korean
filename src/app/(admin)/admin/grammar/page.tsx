import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TOPIK_LEVEL_LABELS, TOPIK_LEVEL_COLORS } from "@/lib/utils";
import { Plus, Pencil } from "lucide-react";

export default async function AdminGrammarPage() {
  const units = await db.grammarUnit.findMany({
    orderBy: [{ topikLevel: "asc" }, { order: "asc" }],
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Grammar Units</h1>
        <Button asChild>
          <Link href="/admin/grammar/new"><Plus className="h-4 w-4 mr-1" /> New Unit</Link>
        </Button>
      </div>
      <div className="space-y-2">
        {units.map((unit) => (
          <Card key={unit.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={TOPIK_LEVEL_COLORS[unit.topikLevel]}>{TOPIK_LEVEL_LABELS[unit.topikLevel]}</Badge>
                  <Badge variant="secondary" className="font-mono text-xs">{unit.pattern}</Badge>
                </div>
                <p className="font-medium">{unit.title}</p>
                <p className="text-sm text-muted-foreground hangul-text">{unit.titleKo}</p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/admin/grammar/${unit.id}`}><Pencil className="h-3 w-3 mr-1" /> Edit</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
