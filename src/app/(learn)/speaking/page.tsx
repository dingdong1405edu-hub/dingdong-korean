import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TOPIK_LEVEL_LABELS, TOPIK_LEVEL_COLORS, SPEECH_LEVEL_LABELS } from "@/lib/utils";
import { Mic, ChevronRight, Clock } from "lucide-react";

const TASK_TYPE_LABELS: Record<string, string> = {
  CONVERSATION: "Hội thoại",
  PICTURE_DESC: "Mô tả ảnh",
  OPINION: "Trình bày ý kiến",
  ROLEPLAY: "Nhập vai",
};

export default async function SpeakingPage() {
  const sets = await db.speakingSet.findMany({
    orderBy: [{ topikLevel: "asc" }],
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">말하기 — Luyện nói tiếng Hàn</h1>
        <p className="text-muted-foreground mt-1">Ghi âm và nhận phản hồi từ AI về phát âm, ngữ pháp, lưu loát</p>
      </div>

      <div className="space-y-3">
        {sets.map((set) => (
          <Link key={set.id} href={`/speaking/${set.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg mt-0.5">
                    <Mic className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={TOPIK_LEVEL_COLORS[set.topikLevel]}>{TOPIK_LEVEL_LABELS[set.topikLevel]}</Badge>
                      <Badge variant="outline" className="text-xs">
                        {TASK_TYPE_LABELS[set.taskType]}
                      </Badge>
                      <Badge variant="secondary" className="text-xs font-mono">
                        {SPEECH_LEVEL_LABELS[set.speechLevel]}
                      </Badge>
                    </div>
                    <p className="font-semibold">{set.topic}</p>
                    <p className="text-sm text-muted-foreground hangul-text">{set.topicKo}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>준비 {set.prepTimeSec}초</span>
                      <span className="flex items-center gap-1">
                        <Mic className="h-3 w-3" /> {set.speakTimeSec}초
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </CardContent>
            </Card>
          </Link>
        ))}
        {sets.length === 0 && (
          <p className="text-center text-muted-foreground py-12">Chưa có bài luyện nói. Admin thêm bài mới nhé.</p>
        )}
      </div>
    </div>
  );
}
