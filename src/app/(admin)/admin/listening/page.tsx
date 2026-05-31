import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TOPIK_LEVEL_LABELS, TOPIK_LEVEL_COLORS } from "@/lib/utils";
import { Plus, Pencil } from "lucide-react";

export default async function AdminListeningPage() {
  const tests = await db.listeningTest.findMany({
    orderBy: [{ topikLevel: "asc" }],
    include: { _count: { select: { questions: true } } },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Listening Tests</h1>
        <Button asChild>
          <Link href="/admin/listening/new">
            <Plus className="h-4 w-4 mr-1" /> New Test
          </Link>
        </Button>
      </div>
      <div className="space-y-2">
        {tests.map((test) => (
          <Card key={test.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <Badge className={TOPIK_LEVEL_COLORS[test.topikLevel]}>{TOPIK_LEVEL_LABELS[test.topikLevel]}</Badge>
                <p className="font-medium mt-1">{test.title}</p>
                <p className="text-xs text-muted-foreground">{test._count.questions} questions • {test.audioUrl ? "Audio OK" : "No audio"}</p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/admin/listening/${test.id}`}><Pencil className="h-3 w-3 mr-1" /> Edit</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
