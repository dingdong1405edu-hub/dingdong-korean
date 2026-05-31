import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Headphones, PenLine, Mic, BookMarked, GraduationCap, Users, AlignLeft } from "lucide-react";

export default async function AdminOverviewPage() {
  const [
    users, vocabUnits, grammarUnits, hangulSets,
    readingTests, listeningTests, writingTasks, speakingSets, attempts
  ] = await Promise.all([
    db.user.count(),
    db.vocabUnit.count(),
    db.grammarUnit.count(),
    db.hangulSet.count(),
    db.readingTest.count(),
    db.listeningTest.count(),
    db.writingTask.count(),
    db.speakingSet.count(),
    db.attempt.count(),
  ]);

  const stats = [
    { label: "Users", value: users, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Vocab Units", value: vocabUnits, icon: BookMarked, color: "text-indigo-600 bg-indigo-50" },
    { label: "Grammar Units", value: grammarUnits, icon: GraduationCap, color: "text-purple-600 bg-purple-50" },
    { label: "Hangul Sets", value: hangulSets, icon: AlignLeft, color: "text-pink-600 bg-pink-50" },
    { label: "Reading Tests", value: readingTests, icon: BookOpen, color: "text-green-600 bg-green-50" },
    { label: "Listening Tests", value: listeningTests, icon: Headphones, color: "text-yellow-600 bg-yellow-50" },
    { label: "Writing Tasks", value: writingTasks, icon: PenLine, color: "text-orange-600 bg-orange-50" },
    { label: "Speaking Sets", value: speakingSets, icon: Mic, color: "text-red-600 bg-red-50" },
    { label: "Total Attempts", value: attempts, icon: BookOpen, color: "text-zinc-600 bg-zinc-50" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
