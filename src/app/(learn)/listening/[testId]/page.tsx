import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ListeningPlayer } from "@/components/learn/ListeningPlayer";
import { Badge } from "@/components/ui/badge";
import { TOPIK_LEVEL_LABELS, TOPIK_LEVEL_COLORS } from "@/lib/utils";

export default async function ListeningTestPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  const test = await db.listeningTest.findUnique({
    where: { id: testId },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  if (!test) notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <Badge className={TOPIK_LEVEL_COLORS[test.topikLevel]}>{TOPIK_LEVEL_LABELS[test.topikLevel]}</Badge>
        <h1 className="text-2xl font-bold mt-1">{test.title}</h1>
      </div>
      <ListeningPlayer test={test} />
    </div>
  );
}
