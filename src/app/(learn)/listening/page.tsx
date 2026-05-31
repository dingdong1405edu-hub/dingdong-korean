import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TOPIK_LEVEL_LABELS, TOPIK_LEVEL_COLORS } from "@/lib/utils";
import { Headphones, ChevronRight } from "lucide-react";

export default async function ListeningPage() {
  const tests = await db.listeningTest.findMany({
    orderBy: [{ topikLevel: "asc" }],
    include: { _count: { select: { questions: true } } },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">듣기 — Nghe hiểu TOPIK</h1>
        <p className="text-muted-foreground mt-1">Luyện nghe audio tiếng Hàn chuẩn Seoul dialect</p>
      </div>

      <div className="space-y-3">
        {tests.map((test) => (
          <Link key={test.id} href={`/listening/${test.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <Headphones className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={TOPIK_LEVEL_COLORS[test.topikLevel]}>
                        {TOPIK_LEVEL_LABELS[test.topikLevel]}
                      </Badge>
                    </div>
                    <p className="font-semibold">{test.title}</p>
                    <p className="text-xs text-muted-foreground">{test._count.questions} câu hỏi</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
        {tests.length === 0 && (
          <p className="text-center text-muted-foreground py-12">Chưa có bài nghe. Admin thêm bài mới nhé.</p>
        )}
      </div>
    </div>
  );
}
