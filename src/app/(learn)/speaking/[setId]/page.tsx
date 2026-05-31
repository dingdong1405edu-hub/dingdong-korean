import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { SpeakingRecorder } from "@/components/learn/SpeakingRecorder";
import { Badge } from "@/components/ui/badge";
import { TOPIK_LEVEL_LABELS, TOPIK_LEVEL_COLORS, SPEECH_LEVEL_LABELS } from "@/lib/utils";

const TASK_LABELS: Record<string, string> = {
  CONVERSATION: "Hội thoại",
  PICTURE_DESC: "Mô tả ảnh",
  OPINION: "Trình bày ý kiến",
  ROLEPLAY: "Nhập vai",
};

export default async function SpeakingSetPage({ params }: { params: Promise<{ setId: string }> }) {
  const { setId } = await params;
  const set = await db.speakingSet.findUnique({ where: { id: setId } });
  if (!set) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge className={TOPIK_LEVEL_COLORS[set.topikLevel]}>{TOPIK_LEVEL_LABELS[set.topikLevel]}</Badge>
          <Badge variant="outline">{TASK_LABELS[set.taskType]}</Badge>
          <Badge variant="secondary" className="font-mono">{SPEECH_LEVEL_LABELS[set.speechLevel]}</Badge>
        </div>
        <h1 className="text-2xl font-bold">{set.topic}</h1>
        <p className="text-muted-foreground hangul-text">{set.topicKo}</p>
      </div>
      <SpeakingRecorder set={set} />
    </div>
  );
}
