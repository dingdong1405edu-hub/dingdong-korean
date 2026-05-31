"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Play, Pause, Volume2, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

interface Question {
  id: string;
  type: string;
  prompt: string;
  options: unknown;
  correctAnswer: unknown;
  explanation?: string | null;
}

interface ListeningPlayerProps {
  test: {
    id: string;
    title: string;
    audioUrl: string;
    transcript?: string | null;
    questions: Question[];
  };
}

export function ListeningPlayer({ test }: ListeningPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = test.questions;
  const score = submitted
    ? questions.filter((q) => {
        const correct = typeof q.correctAnswer === "string" ? q.correctAnswer : JSON.stringify(q.correctAnswer);
        return answers[q.id] === correct;
      }).length
    : 0;

  function togglePlay() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  }

  function changeSpeed(s: number) {
    setSpeed(s);
    if (audioRef.current) audioRef.current.playbackRate = s;
  }

  function formatTime(s: number) {
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  }

  const speeds = [0.75, 1, 1.25, 1.5];
  const allAnswered = questions.every((q) => answers[q.id]);

  return (
    <div className="space-y-4">
      {/* Audio Player */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <audio
            ref={audioRef}
            src={test.audioUrl}
            onTimeUpdate={(e) => setCurrentTime((e.target as HTMLAudioElement).currentTime)}
            onLoadedMetadata={(e) => setDuration((e.target as HTMLAudioElement).duration)}
            onEnded={() => setPlaying(false)}
          />

          <div className="flex items-center gap-3">
            <Button size="icon" variant="outline" onClick={togglePlay}>
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div className="flex-1">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div
                className="h-2 bg-zinc-200 rounded-full cursor-pointer"
                onClick={(e) => {
                  if (!audioRef.current) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  audioRef.current.currentTime = pct * duration;
                }}
              >
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
                />
              </div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => { if (audioRef.current) audioRef.current.currentTime = 0; }}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Speed control */}
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Tốc độ:</span>
            {speeds.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={speed === s ? "default" : "outline"}
                className="h-7 px-2 text-xs"
                onClick={() => changeSpeed(s)}
              >
                {s}x
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Câu hỏi</h2>
          {submitted && (
            <Badge>{score}/{questions.length} đúng</Badge>
          )}
        </div>

        {questions.map((q, idx) => {
          const options = (q.options as string[]) ?? [];
          const correctAnswer = typeof q.correctAnswer === "string" ? q.correctAnswer : JSON.stringify(q.correctAnswer);
          const userAnswer = answers[q.id];

          return (
            <Card key={q.id} className={cn(
              submitted && userAnswer === correctAnswer && "border-green-400",
              submitted && userAnswer && userAnswer !== correctAnswer && "border-red-400"
            )}>
              <CardContent className="p-4 space-y-3">
                <p className="text-sm font-medium">
                  <span className="font-bold text-muted-foreground mr-2">{idx + 1}.</span>
                  <span className="hangul-text">{q.prompt}</span>
                </p>
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
                  <p className="text-xs text-muted-foreground bg-zinc-50 rounded p-2">💡 {q.explanation}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submit */}
      {!submitted && (
        <Button className="w-full" disabled={!allAnswered} onClick={() => setSubmitted(true)}>
          Nộp bài
        </Button>
      )}

      {/* Transcript */}
      {test.transcript && submitted && (
        <Card>
          <CardContent className="p-4">
            <button
              className="flex items-center justify-between w-full text-sm font-medium"
              onClick={() => setShowTranscript(!showTranscript)}
            >
              <span>Xem transcript</span>
              {showTranscript ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showTranscript && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 text-sm hangul-text leading-relaxed text-muted-foreground"
              >
                {test.transcript}
              </motion.div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
