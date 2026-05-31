"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface Question {
  type: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export default function NewReadingTestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    titleKo: "",
    topikLevel: "TOPIK1",
    passage: "",
    timeLimit: 40,
  });
  const [questions, setQuestions] = useState<Question[]>([
    { type: "MCQ", prompt: "", options: ["", "", "", ""], correctAnswer: "", explanation: "" },
  ]);

  function addQuestion() {
    setQuestions([...questions, { type: "MCQ", prompt: "", options: ["", "", "", ""], correctAnswer: "", explanation: "" }]);
  }

  function removeQuestion(idx: number) {
    setQuestions(questions.filter((_, i) => i !== idx));
  }

  function updateQuestion(idx: number, field: keyof Question, value: unknown) {
    const updated = [...questions];
    (updated[idx] as unknown as Record<string, unknown>)[field] = value;
    setQuestions(updated);
  }

  function updateOption(qIdx: number, optIdx: number, value: string) {
    const updated = [...questions];
    updated[qIdx].options[optIdx] = value;
    setQuestions(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/reading", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, questions }),
    });
    if (res.ok) {
      toast.success("Test created!");
      router.push("/admin/reading");
    } else {
      toast.error("Failed to create test");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-xl font-bold">New Reading Test</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Test Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Title (EN)</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <Label>Title (KO)</Label>
                <Input value={form.titleKo} onChange={(e) => setForm({ ...form, titleKo: e.target.value })} className="hangul-text" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>TOPIK Level</Label>
                <Select value={form.topikLevel} onValueChange={(v) => setForm({ ...form, topikLevel: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["TOPIK1","TOPIK2","TOPIK3","TOPIK4","TOPIK5","TOPIK6"].map((l) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Time Limit (min)</Label>
                <Input type="number" value={form.timeLimit} onChange={(e) => setForm({ ...form, timeLimit: +e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Passage (Korean)</Label>
              <Textarea
                value={form.passage}
                onChange={(e) => setForm({ ...form, passage: e.target.value })}
                className="min-h-[200px] hangul-text"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Questions</h2>
            <Button type="button" size="sm" variant="outline" onClick={addQuestion}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          {questions.map((q, idx) => (
            <Card key={idx}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Question {idx + 1}</span>
                  <Button type="button" size="icon" variant="ghost" onClick={() => removeQuestion(idx)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <div>
                  <Label>Prompt (Korean)</Label>
                  <Textarea
                    value={q.prompt}
                    onChange={(e) => updateQuestion(idx, "prompt", e.target.value)}
                    className="hangul-text min-h-[60px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx}>
                      <Label className="text-xs">Option {optIdx + 1}</Label>
                      <Input
                        value={opt}
                        onChange={(e) => updateOption(idx, optIdx, e.target.value)}
                        className="hangul-text text-sm"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <Label>Correct Answer</Label>
                  <Input
                    value={q.correctAnswer}
                    onChange={(e) => updateQuestion(idx, "correctAnswer", e.target.value)}
                    className="hangul-text"
                  />
                </div>
                <div>
                  <Label>Explanation</Label>
                  <Input
                    value={q.explanation}
                    onChange={(e) => updateQuestion(idx, "explanation", e.target.value)}
                    className="hangul-text"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Test
        </Button>
      </form>
    </div>
  );
}
