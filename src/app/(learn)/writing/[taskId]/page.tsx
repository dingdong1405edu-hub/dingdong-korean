import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { WritingEditor } from "@/components/learn/WritingEditor";
import { Badge } from "@/components/ui/badge";
import { TOPIK_LEVEL_LABELS, TOPIK_LEVEL_COLORS } from "@/lib/utils";

const TASK_LABELS: Record<string, string> = {
  TOPIK_51: "Task 51",
  TOPIK_52: "Task 52",
  TOPIK_53: "Task 53",
  FREE: "Viết tự do",
};

export default async function WritingTaskPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  const task = await db.writingTask.findUnique({ where: { id: taskId } });
  if (!task) notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge className={TOPIK_LEVEL_COLORS[task.topikLevel]}>{TOPIK_LEVEL_LABELS[task.topikLevel]}</Badge>
          <Badge variant="outline">{TASK_LABELS[task.taskType]}</Badge>
          {task.requireFormal && <Badge variant="secondary">합쇼체 요구</Badge>}
        </div>
        <h1 className="text-xl font-bold">{task.prompt}</h1>
      </div>
      <WritingEditor task={task} />
    </div>
  );
}
