import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TOPIK_LEVEL_LABELS, TOPIK_LEVEL_COLORS } from "@/lib/utils";
import { Plus, Pencil } from "lucide-react";

export default async function AdminReadingPage() {
  const tests = await db.readingTest.findMany({
    orderBy: [{ topikLevel: "asc" }],
    include: { _count: { select: { questions: true } } },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Reading Tests</h1>
        <Button asChild>
          <Link href="/admin/reading/new">
            <Plus className="h-4 w-4 mr-1" /> New Test
          </Link>
        </Button>
      </div>
      <div className="space-y-2">
        {tests.map((test) => (
          <Card key={test.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={TOPIK_LEVEL_COLORS[test.topikLevel]}>{TOPIK_LEVEL_LABELS[test.topikLevel]}</Badge>
                </div>
                <p className="font-medium">{test.title}</p>
                <p className="text-xs text-muted-foreground">{test._count.questions} questions</p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/admin/reading/${test.id}`}>
                  <Pencil className="h-3 w-3 mr-1" /> Edit
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
