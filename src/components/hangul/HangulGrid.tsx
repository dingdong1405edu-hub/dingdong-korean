"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { decomposeHangul } from "@/lib/romanization";

interface HangulChar {
  hangul: string;
  romaji: string;
  jamo: string;
  example: string;
}

interface HangulSetData {
  id: string;
  type: string;
  category: string;
  characters: unknown;
}

interface HangulGridProps {
  set: HangulSetData;
}

export function HangulGrid({ set }: HangulGridProps) {
  const chars = set.characters as HangulChar[];
  const [selected, setSelected] = useState<HangulChar | null>(null);
  const [quizMode, setQuizMode] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{set.category}</CardTitle>
          <Button size="sm" variant="outline" onClick={() => setQuizMode(true)}>
            Quiz
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {chars.map((char) => (
            <motion.button
              key={char.hangul}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(char)}
              className="flex flex-col items-center p-3 rounded-lg border bg-white hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer"
            >
              <span className="text-2xl hangul-text font-bold">{char.hangul}</span>
              <span className="text-xs text-neutral-400 mt-1">{char.romaji}</span>
            </motion.button>
          ))}
        </div>
      </CardContent>

      {/* Character detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-sm">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center">
                  <span className="text-6xl hangul-text font-bold block mb-2">{selected.hangul}</span>
                  <span className="text-xl text-muted-foreground">{selected.romaji}</span>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="text-center">
                  <Badge variant="outline" className="text-base px-3 py-1">{selected.jamo}</Badge>
                </div>
                <div className="bg-zinc-50 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground mb-1">Ví dụ:</p>
                  <p className="hangul-text text-lg font-medium">{selected.example}</p>
                </div>
                {(() => {
                  const decomposed = decomposeHangul(selected.hangul[0]);
                  if (!decomposed) return null;
                  return (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground mb-2">Phân tích âm tiết:</p>
                      <div className="flex items-center justify-center gap-3 text-lg hangul-text">
                        <div className="text-center">
                          <div className="text-xl font-bold">{decomposed.initial}</div>
                          <div className="text-xs text-muted-foreground">초성</div>
                        </div>
                        <span className="text-muted-foreground">+</span>
                        <div className="text-center">
                          <div className="text-xl font-bold">{decomposed.vowel}</div>
                          <div className="text-xs text-muted-foreground">중성</div>
                        </div>
                        {decomposed.final && (
                          <>
                            <span className="text-muted-foreground">+</span>
                            <div className="text-center">
                              <div className="text-xl font-bold">{decomposed.final}</div>
                              <div className="text-xs text-muted-foreground">받침</div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Quiz mode */}
      {quizMode && (
        <HangulQuiz chars={chars} onClose={() => setQuizMode(false)} />
      )}
    </Card>
  );
}

function HangulQuiz({ chars, onClose }: { chars: HangulChar[]; onClose: () => void }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const shuffled = [...chars].sort(() => Math.random() - 0.5).slice(0, Math.min(10, chars.length));
  const question = shuffled[current];

  const options = [...chars]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map((c) => c.romaji);
  if (!options.includes(question.romaji)) {
    options[0] = question.romaji;
    options.sort(() => Math.random() - 0.5);
  }

  function answer(opt: string) {
    setSelected(opt);
    if (opt === question.romaji) setScore((s) => s + 1);
    setTimeout(() => {
      if (current + 1 >= shuffled.length) {
        setFinished(true);
      } else {
        setCurrent((c) => c + 1);
        setSelected(null);
      }
    }, 800);
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Quiz — Nhận biết Hangul</DialogTitle>
        </DialogHeader>
        {finished ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-3">🎉</div>
            <p className="text-xl font-bold">{score}/{shuffled.length}</p>
            <p className="text-muted-foreground mb-4">điểm đúng</p>
            <Button onClick={onClose}>Đóng</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xs text-muted-foreground text-right">
              {current + 1}/{shuffled.length}
            </div>
            <div className="text-center text-7xl hangul-text font-bold py-6">
              {question.hangul}
            </div>
            <p className="text-center text-sm text-muted-foreground">Phiên âm romanization là gì?</p>
            <div className="grid grid-cols-2 gap-2">
              {options.map((opt) => (
                <Button
                  key={opt}
                  variant={
                    selected === null
                      ? "outline"
                      : opt === question.romaji
                      ? "default"
                      : opt === selected
                      ? "destructive"
                      : "outline"
                  }
                  disabled={!!selected}
                  onClick={() => answer(opt)}
                  className="h-12 text-base"
                >
                  {opt}
                </Button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
