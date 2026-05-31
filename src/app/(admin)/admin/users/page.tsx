import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TOPIK_LEVEL_LABELS, TOPIK_LEVEL_COLORS } from "@/lib/utils";
import { Heart, Zap, Flame } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { attempts: true } } },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Users ({users.length})</h1>
      <div className="space-y-2">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                  {user.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div>
                  <p className="font-medium text-sm">{user.name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Badge className={TOPIK_LEVEL_COLORS[user.topikLevel]}>{TOPIK_LEVEL_LABELS[user.topikLevel]}</Badge>
                <span className="flex items-center gap-1 text-amber-600">
                  <Zap className="h-3.5 w-3.5" />{user.xp}
                </span>
                <span className="flex items-center gap-1 text-red-500">
                  <Heart className="h-3.5 w-3.5" />{user.hearts}
                </span>
                <span className="flex items-center gap-1 text-orange-500">
                  <Flame className="h-3.5 w-3.5" />{user.streakDays}
                </span>
                <Badge variant="outline" className="text-xs">{user._count.attempts} attempts</Badge>
                <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className="text-xs">
                  {user.role}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
