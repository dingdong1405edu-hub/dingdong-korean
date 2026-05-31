import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TOPIK_LEVEL_LABELS, TOPIK_LEVEL_COLORS } from "@/lib/utils";
import { Plus, Pencil } from "lucide-react";

const TASK_LABELS: Record<string, string> = {
  TOPIK_51: "Task 51",
  TOPIK_52: "Task 52",
  TOPIK_53: "Task 53",
  FREE: "Free",
};

export default async function AdminWritingPage() {
  const tasks = await db.writingTask.findMany({ orderBy: [{ topikLevel: "asc" }] });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Writing Tasks</h1>
        <Button asChild>
          <Link href="/admin/writing/new">
            <Plus className="h-4 w-4 mr-1" /> New Task
          </Link>
        </Button>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={TOPIK_LEVEL_COLORS[task.topikLevel]}>{TOPIK_LEVEL_LABELS[task.topikLevel]}</Badge>
                  <Badge variant="outline">{TASK_LABELS[task.taskType]}</Badge>
                  {task.requireFormal && <Badge variant="secondary" className="text-xs">합쇼체</Badge>}
                </div>
                <p className="text-sm line-clamp-1">{task.prompt}</p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/admin/writing/${task.id}`}>
                  <Pencil className="h-3 w-3 mr-1" /> Edit
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
