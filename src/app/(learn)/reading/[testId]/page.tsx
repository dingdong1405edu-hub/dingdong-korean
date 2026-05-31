import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ReadingTest } from "@/components/learn/ReadingTest";
import { Badge } from "@/components/ui/badge";
import { TOPIK_LEVEL_LABELS, TOPIK_LEVEL_COLORS } from "@/lib/utils";

export default async function ReadingTestPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  const test = await db.readingTest.findUnique({
    where: { id: testId },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  if (!test) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge className={TOPIK_LEVEL_COLORS[test.topikLevel]}>
            {TOPIK_LEVEL_LABELS[test.topikLevel]}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold">{test.title}</h1>
      </div>
      <ReadingTest test={test} />
    </div>
  );
}
