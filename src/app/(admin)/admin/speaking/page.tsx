import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TOPIK_LEVEL_LABELS, TOPIK_LEVEL_COLORS, SPEECH_LEVEL_LABELS } from "@/lib/utils";
import { Plus, Pencil } from "lucide-react";

const TASK_LABELS: Record<string, string> = {
  CONVERSATION: "Hội thoại",
  PICTURE_DESC: "Mô tả ảnh",
  OPINION: "Ý kiến",
  ROLEPLAY: "Nhập vai",
};

export default async function AdminSpeakingPage() {
  const sets = await db.speakingSet.findMany({ orderBy: [{ topikLevel: "asc" }] });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Speaking Sets</h1>
        <Button asChild>
          <Link href="/admin/speaking/new">
            <Plus className="h-4 w-4 mr-1" /> New Set
          </Link>
        </Button>
      </div>
      <div className="space-y-2">
        {sets.map((set) => (
          <Card key={set.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={TOPIK_LEVEL_COLORS[set.topikLevel]}>{TOPIK_LEVEL_LABELS[set.topikLevel]}</Badge>
                  <Badge variant="outline">{TASK_LABELS[set.taskType]}</Badge>
                  <Badge variant="secondary" className="font-mono text-xs">{SPEECH_LEVEL_LABELS[set.speechLevel]}</Badge>
                </div>
                <p className="font-medium">{set.topic}</p>
                <p className="text-xs text-muted-foreground hangul-text">{set.topicKo}</p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/admin/speaking/${set.id}`}><Pencil className="h-3 w-3 mr-1" /> Edit</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
