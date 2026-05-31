"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { tokenizeKorean, romanize } from "@/lib/romanization";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, CheckCircle, XCircle, Clock } from "lucide-react";

interface Question {
  id: string;
  type: string;
  prompt: string;
  options: unknown;
  correctAnswer: unknown;
  explanation?: string | null;
}

interface ReadingTestProps {
  test: {
    id: string;
    title: string;
    passage: string;
    timeLimit: number;
    questions: Question[];
  };
}

export function ReadingTest({ test }: ReadingTestProps) {
  const [showRomaji, setShowRomaji] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [lookupWord, setLookupWord] = useState<string | null>(null);
  const [timeLeft] = useState(test.timeLimit * 60);

  const tokens = tokenizeKorean(test.passage);
  const questions = test.questions;
  const score = submitted
    ? questions.filter((q) => {
        const correct = typeof q.correctAnswer === "string" ? q.correctAnswer : JSON.stringify(q.correctAnswer);
        return answers[q.id] === correct;
      }).length
    : 0;

  function handleWordClick(word: string) {
    if (/[가-힣]/.test(word)) {
      setLookupWord(word);
    }
  }

  function handleSubmit() {
    setSubmitted(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  const allAnswered = questions.every((q) => answers[q.id]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Passage */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Bài đọc</h2>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" /> {test.timeLimit} phút
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowRomaji(!showRomaji)}
            >
              {showRomaji ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
              {showRomaji ? "Ẩn" : "Hiện"} phiên âm
            </Button>
          </div>
        </div>
        <Card>
          <CardContent className="p-5">
            <div className="leading-relaxed text-base hangul-text">
              {tokens.map((token, i) => {
                if (!token.isKorean) {
                  return token.text === "\n" ? <br key={i} /> : <span key={i}>{token.text}</span>;
                }
                return (
                  <span key={i} className="inline-flex flex-col items-center mx-0.5 cursor-pointer hover:bg-blue-50 rounded px-0.5">
                    <button
                      onClick={() => handleWordClick(token.text)}
                      className="text-base font-medium"
                    >
                      {token.text}
                    </button>
                    {showRomaji && (
                      <span className="text-xs text-neutral-400 leading-none">
                        {romanize(token.text)}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Câu hỏi ({questions.length})</h2>
          {submitted && (
            <Badge variant={score === questions.length ? "default" : "secondary"}>
              {score}/{questions.length} đúng
            </Badge>
          )}
        </div>

        {questions.map((q, idx) => {
          const options = (q.options as string[]) ?? [];
          const correctAnswer = typeof q.correctAnswer === "string" ? q.correctAnswer : JSON.stringify(q.correctAnswer);
          const userAnswer = answers[q.id];
          const isCorrect = submitted && userAnswer === correctAnswer;
          const isWrong = submitted && userAnswer && userAnswer !== correctAnswer;

          return (
            <Card key={q.id} className={cn(
              submitted && isCorrect && "border-green-400",
              submitted && isWrong && "border-red-400"
            )}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-sm font-bold text-muted-foreground">{idx + 1}.</span>
                  <p className="text-sm font-medium hangul-text">{q.prompt}</p>
                </div>
                <div className="space-y-2">
                  {options.map((opt) => (
                    <button
                      key={opt}
                      disabled={submitted}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm border transition-colors",
                        !submitted && userAnswer === opt && "bg-blue-50 border-blue-400",
                        !submitted && userAnswer !== opt && "hover:bg-zinc-50",
                        submitted && opt === correctAnswer && "bg-green-50 border-green-400 text-green-700",
                        submitted && opt === userAnswer && opt !== correctAnswer && "bg-red-50 border-red-400 text-red-700"
                      )}
                    >
                      <span className="hangul-text">{opt}</span>
                    </button>
                  ))}
                </div>
                {submitted && q.explanation && (
                  <p className="text-xs text-muted-foreground bg-zinc-50 rounded p-2">
                    💡 {q.explanation}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}

        {!submitted && (
          <Button
            className="w-full"
            disabled={!allAnswered}
            onClick={handleSubmit}
          >
            Nộp bài
          </Button>
        )}

        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-4"
          >
            <div className="text-4xl mb-2">{score === questions.length ? "🎉" : score >= questions.length / 2 ? "👍" : "💪"}</div>
            <p className="font-bold text-lg">Kết quả: {score}/{questions.length}</p>
            <p className="text-muted-foreground text-sm">
              {Math.round((score / questions.length) * 100)}% chính xác
            </p>
            <Button variant="outline" className="mt-3" onClick={() => window.location.href = "/reading"}>
              Quay lại
            </Button>
          </motion.div>
        )}
      </div>

      {/* Word lookup dialog */}
      <Dialog open={!!lookupWord} onOpenChange={() => setLookupWord(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="hangul-text text-3xl text-center">{lookupWord}</DialogTitle>
          </DialogHeader>
          {lookupWord && (
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">{romanize(lookupWord)}</p>
              <p className="text-sm text-muted-foreground italic">
                (Tra từ điển để xem nghĩa đầy đủ)
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
