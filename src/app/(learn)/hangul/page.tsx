import { db } from "@/lib/db";
import { HangulGrid } from "@/components/hangul/HangulGrid";
import { Badge } from "@/components/ui/badge";

export default async function HangulPage() {
  const sets = await db.hangulSet.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">한글 — Học Bảng Chữ Hangul</h1>
        <p className="text-muted-foreground mt-1">
          Học bảng chữ cái Hàn từ cơ bản đến nâng cao, bao gồm nguyên âm, phụ âm và batchim
        </p>
      </div>

      <div className="space-y-8">
        {sets.map((set) => (
          <HangulGrid key={set.id} set={set} />
        ))}
      </div>
    </div>
  );
}
