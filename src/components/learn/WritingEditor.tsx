"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { countHangulChars } from "@/lib/romanization";
import type { WritingFeedback } from "@/lib/claude";

interface WritingTask {
  id: string;
  taskType: string;
  prompt: string;
  promptKo?: string | null;
  minChars: number;
  timeLimit: number;
  topikLevel: string;
  requireFormal: boolean;
}

interface WritingEditorProps {
  task: WritingTask;
}

export function WritingEditor({ task }: WritingEditorProps) {
  const [text, setText] = useState("");
  const [hangulCount, setHangulCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [timeLeft, setTimeLeft] = useState(task.timeLimit * 60);
  const [showAnnotations, setShowAnnotations] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setText(val);
    setHangulCount(countHangulChars(val));
  }

  async function handleSubmit() {
    if (hangulCount < task.minChars) {
      toast.error(`Cần ít nhất ${task.minChars} ký tự Hangul`);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/grade/writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          taskId: task.id,
          taskType: task.taskType,
          level: task.topikLevel,
          requireFormal: task.requireFormal,
        }),
      });
      if (!res.ok) throw new Error("Grading failed");
      const data = await res.json();
      setFeedback(data.feedback);
    } catch {
      toast.error("Lỗi khi chấm bài. Vui lòng thử lại.");
    }
    setSubmitting(false);
  }

  const charProgress = Math.min((hangulCount / task.minChars) * 100, 100);
  const timeMinutes = Math.floor(timeLeft / 60);
  const timeSeconds = timeLeft % 60;
  const timeWarning = timeLeft <= 120;

  return (
    <div className="space-y-4">
      {/* Prompt */}
      {task.promptKo && (
        <Card className="bg-zinc-50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Đề bài:</p>
            <p className="hangul-text text-sm leading-relaxed whitespace-pre-line">{task.promptKo}</p>
          </CardContent>
        </Card>
      )}

      {!feedback ? (
        <Card>
          <CardContent className="p-4 space-y-3">
            {/* Timer + char count */}
            <div className="flex items-center justify-between text-sm">
              <span className={`flex items-center gap-1 font-mono ${timeWarning ? "text-red-500" : "text-muted-foreground"}`}>
                <Clock className="h-4 w-4" />
                {timeMinutes}:{timeSeconds.toString().padStart(2, "0")}
              </span>
              <span className={hangulCount >= task.minChars ? "text-green-600 font-medium" : "text-muted-foreground"}>
                {hangulCount} / {task.minChars} ký tự Hangul
              </span>
            </div>
            <Progress value={charProgress} className="h-1.5" />

            {/* Editor */}
            <textarea
              value={text}
              onChange={handleChange}
              placeholder="Viết tiếng Hàn vào đây... (한국어로 입력하세요)"
              className="w-full min-h-[300px] border rounded-md px-3 py-2 text-base hangul-text resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
              disabled={submitting || timeLeft === 0}
            />

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={submitting || hangulCount < task.minChars || timeLeft === 0}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  AI đang chấm bài...
                </>
              ) : (
                "Nộp bài để AI chấm"
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Score overview */}
            <Card className="border-2 border-blue-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Kết quả chấm bài</CardTitle>
                  <div className="text-3xl font-bold text-blue-600">
                    {feedback.score}/{feedback.maxScore}
                  </div>
                </div>
                <Progress value={(feedback.score / feedback.maxScore) * 100} className="h-2" />
              </CardHeader>
            </Card>

            {/* Criteria breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(feedback.criteria).map(([key, crit]) => {
                const labels: Record<string, string> = {
                  content: "Nội dung (내용)",
                  grammar: "Ngữ pháp (문법)",
                  vocabulary: "Từ vựng (어휘)",
                  formality: "Văn phong (격식)",
                };
                const pct = (crit.score / crit.maxScore) * 100;
                return (
                  <Card key={key}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{labels[key]}</span>
                        <span className="text-sm font-bold">{crit.score}/{crit.maxScore}</span>
                      </div>
                      <Progress value={pct} className="h-1.5 mb-2" />
                      <p className="text-xs text-muted-foreground">{crit.feedback}</p>
                      {key === "grammar" && "errors" in crit && (crit as { errors?: string[] }).errors?.length ? (
                        <ul className="mt-2 space-y-1">
                          {(crit as { errors: string[] }).errors.map((e, i) => (
                            <li key={i} className="text-xs text-red-600">• {e}</li>
                          ))}
                        </ul>
                      ) : null}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Annotations */}
            {feedback.annotations?.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <button
                    className="flex items-center justify-between w-full font-medium text-sm mb-3"
                    onClick={() => setShowAnnotations(!showAnnotations)}
                  >
                    <span>Lỗi cụ thể ({feedback.annotations.length})</span>
                    {showAnnotations ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {showAnnotations && (
                    <div className="space-y-3">
                      {feedback.annotations.map((ann, i) => (
                        <div key={i} className="bg-red-50 rounded-lg p-3 text-sm">
                          <p className="hangul-text">
                            <span className="line-through text-red-600">{ann.original}</span>
                            <span className="mx-2">→</span>
                            <span className="text-green-700 font-medium">{ann.correction}</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{ann.explanation}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Corrected version */}
            {feedback.correctedVersion && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-green-700">Bài đã sửa</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="hangul-text text-sm leading-relaxed whitespace-pre-line">
                    {feedback.correctedVersion}
                  </p>
                </CardContent>
              </Card>
            )}

            <Button variant="outline" onClick={() => window.location.href = "/writing"}>
              Quay lại danh sách
            </Button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
