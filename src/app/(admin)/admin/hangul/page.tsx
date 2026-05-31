import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminHangulPage() {
  const sets = await db.hangulSet.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Hangul Sets</h1>
      <div className="space-y-2">
        {sets.map((set) => {
          const chars = set.characters as Array<{ hangul: string }>;
          return (
            <Card key={set.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{set.type}</Badge>
                  <span className="font-medium">{set.category}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {chars.map((c) => (
                    <span key={c.hangul} className="hangul-text text-lg px-1">{c.hangul}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
