import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { VocabLesson } from "@/components/learn/VocabLesson";

export default async function VocabUnitPage({ params }: { params: Promise<{ unitId: string }> }) {
  const { unitId } = await params;
  const unit = await db.vocabUnit.findUnique({
    where: { id: unitId },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!unit) notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{unit.title}</h1>
        <p className="text-muted-foreground hangul-text">{unit.titleKo}</p>
      </div>
      <VocabLesson unit={unit} />
    </div>
  );
}
