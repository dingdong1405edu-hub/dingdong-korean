import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TOPIK_LEVEL_LABELS, TOPIK_LEVEL_COLORS } from "@/lib/utils";
import { PenLine, ChevronRight, Clock, AlignLeft } from "lucide-react";

const TASK_TYPE_LABELS: Record<string, string> = {
  TOPIK_51: "TOPIK Task 51 — Điền vào chỗ trống",
  TOPIK_52: "TOPIK Task 52 — Viết đoạn ngắn",
  TOPIK_53: "TOPIK Task 53 — Viết luận dài",
  FREE: "Viết tự do",
};

export default async function WritingPage() {
  const tasks = await db.writingTask.findMany({
    orderBy: [{ topikLevel: "asc" }, { taskType: "asc" }],
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">쓰기 — Luyện viết TOPIK II</h1>
        <p className="text-muted-foreground mt-1">AI chấm điểm theo rubric TOPIK chính thức</p>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <Link key={task.id} href={`/writing/${task.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg mt-0.5">
                    <PenLine className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={TOPIK_LEVEL_COLORS[task.topikLevel]}>{TOPIK_LEVEL_LABELS[task.topikLevel]}</Badge>
                      {task.requireFormal && (
                        <Badge variant="outline" className="text-xs">합쇼체 요구</Badge>
                      )}
                    </div>
                    <p className="font-semibold text-sm">{TASK_TYPE_LABELS[task.taskType]}</p>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{task.prompt}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {task.timeLimit} phút
                      </span>
                      <span className="flex items-center gap-1">
                        <AlignLeft className="h-3 w-3" /> min {task.minChars} ký tự
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </CardContent>
            </Card>
          </Link>
        ))}
        {tasks.length === 0 && (
          <p className="text-center text-muted-foreground py-12">Chưa có bài viết. Admin thêm bài mới nhé.</p>
        )}
      </div>
    </div>
  );
}
