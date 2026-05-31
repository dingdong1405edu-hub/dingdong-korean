import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TOPIK_LEVEL_LABELS, TOPIK_LEVEL_COLORS } from "@/lib/utils";
import { Clock, ChevronRight } from "lucide-react";

export default async function ReadingPage() {
  const tests = await db.readingTest.findMany({
    orderBy: [{ topikLevel: "asc" }],
    include: { _count: { select: { questions: true } } },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">읽기 — Đọc hiểu TOPIK</h1>
        <p className="text-muted-foreground mt-1">Luyện đọc hiểu với văn bản tiếng Hàn chuẩn TOPIK</p>
      </div>

      <div className="space-y-3">
        {tests.map((test) => (
          <Link key={test.id} href={`/reading/${test.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={TOPIK_LEVEL_COLORS[test.topikLevel]}>
                      {TOPIK_LEVEL_LABELS[test.topikLevel]}
                    </Badge>
                  </div>
                  <p className="font-semibold">{test.title}</p>
                  <p className="text-sm text-muted-foreground hangul-text">{test.titleKo}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {test.timeLimit} phút
                    </span>
                    <span>{test._count.questions} câu hỏi</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
        {tests.length === 0 && (
          <p className="text-center text-muted-foreground py-12">Chưa có bài đọc hiểu. Admin thêm bài mới nhé.</p>
        )}
      </div>
    </div>
  );
}
