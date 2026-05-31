"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Exercise {
  id: string;
  type: "match" | "translate" | "listen" | "fillBlank" | "sentenceOrder" | "speechLevel";
  question: string;
  answer: string;
  romaji?: string;
  options?: string[];
}

interface VocabUnit {
  id: string;
  title: string;
  titleKo: string;
  lessons: Array<{
    id: string;
    order: number;
    exercises: unknown;
  }>;
}

interface VocabLessonProps {
  unit: VocabUnit;
}

export function VocabLesson({ unit }: VocabLessonProps) {
  const allExercises = unit.lessons.flatMap(
    (l) => l.exercises as Exercise[]
  );

  const [currentIdx, setCurrentIdx] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showRomaji, setShowRomaji] = useState(false);
  const [finished, setFinished] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const exercise = allExercises[currentIdx];
  const progress = Math.round((currentIdx / allExercises.length) * 100);

  const handleAnswer = useCallback(
    (answer: string) => {
      setSelected(answer);
      const correct = answer.trim().toLowerCase() === exercise.answer.trim().toLowerCase();

      if (correct) {
        setScore((s) => s + 10);
        toast.success("Đúng rồi! +10 XP", { duration: 1000 });
      } else {
        setHearts((h) => Math.max(0, h - 1));
        toast.error(`Sai! Đáp án: ${exercise.answer}`, { duration: 1500 });
      }

      setTimeout(() => {
        if (currentIdx + 1 >= allExercises.length) {
          setFinished(true);
        } else {
          setCurrentIdx((i) => i + 1);
          setSelected(null);
          setInputValue("");
          setShowRomaji(false);
        }
      }, 1200);
    },
    [exercise, currentIdx, allExercises.length]
  );

  if (finished) {
    return (
      <Card>
        <CardContent className="py-12 text-center space-y-4">
          <div className="text-6xl">🎉</div>
          <h2 className="text-2xl font-bold">Hoàn thành!</h2>
          <p className="text-muted-foreground">
            Bạn đã hoàn thành unit <strong>{unit.title}</strong>
          </p>
          <div className="flex justify-center gap-6 text-lg font-semibold">
            <div>
              <span className="text-amber-600">{score}</span>
              <span className="text-muted-foreground text-sm ml-1">XP</span>
            </div>
            <div>
              <span className="text-red-500">{hearts}</span>
              <span className="text-muted-foreground text-sm ml-1">♥ còn l���i</span>
            </div>
          </div>
          <Button onClick={() => window.location.href = "/vocab"}>
            Quay lại danh sách
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!exercise) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart
              key={i}
              className="h-5 w-5"
              fill={i < hearts ? "#ef4444" : "none"}
              stroke={i < hearts ? "#ef4444" : "#d1d5db"}
            />
          ))}
        </div>
        <Progress value={progress} className="flex-1 h-3" />
        <span className="text-sm text-muted-foreground">{currentIdx + 1}/{allExercises.length}</span>
      </div>

      {/* Exercise card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={exercise.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Type badge */}
              <div className="flex items-center justify-between">
                <Badge variant="outline">
                  {exercise.type === "match" && "Ghép nghĩa"}
                  {exercise.type === "translate" && "Dịch câu"}
                  {exercise.type === "fillBlank" && "Điền từ"}
                  {exercise.type === "speechLevel" && "Chuyển thể lịch sự"}
                  {exercise.type === "sentenceOrder" && "Sắp xếp câu"}
                  {exercise.type === "listen" && "Nghe và chọn"}
                </Badge>
                {exercise.romaji && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowRomaji(!showRomaji)}
                  >
                    {showRomaji ? "Ẩn" : "Xem"} phiên âm
                  </Button>
                )}
              </div>

              {/* Question */}
              <div className="text-center">
                <p className="text-3xl hangul-text font-bold">{exercise.question}</p>
                {showRomaji && exercise.romaji && (
                  <p className="text-base text-neutral-400 mt-1">{exercise.romaji}</p>
                )}
              </div>

              {/* Options */}
              {exercise.options && exercise.options.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {exercise.options.map((opt) => (
                    <Button
                      key={opt}
                      variant="outline"
                      disabled={!!selected}
                      onClick={() => handleAnswer(opt)}
                      className={cn(
                        "h-auto py-3 px-4 text-left justify-start whitespace-normal",
                        selected === opt && opt === exercise.answer && "bg-green-50 border-green-500 text-green-700",
                        selected === opt && opt !== exercise.answer && "bg-red-50 border-red-500 text-red-700",
                        selected && selected !== opt && opt === exercise.answer && "bg-green-50 border-green-500"
                      )}
                    >
                      {selected === opt ? (
                        opt === exercise.answer ? (
                          <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-2 flex-shrink-0 text-red-600" />
                        )
                      ) : null}
                      {opt}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && inputValue.trim()) handleAnswer(inputValue.trim());
                    }}
                    placeholder="Nhập câu trả lời..."
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!!selected}
                  />
                  <Button
                    className="w-full"
                    disabled={!inputValue.trim() || !!selected}
                    onClick={() => handleAnswer(inputValue.trim())}
                  >
                    Kiểm tra <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
