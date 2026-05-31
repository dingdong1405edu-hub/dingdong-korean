"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, Square, Loader2, Play, RotateCcw } from "lucide-react";
import type { SpeakingFeedback } from "@/lib/claude";

interface SpeakingSet {
  id: string;
  topic: string;
  topicKo: string;
  prompts: unknown;
  speechLevel: string;
  prepTimeSec: number;
  speakTimeSec: number;
  taskType: string;
  topikLevel: string;
}

interface SpeakingRecorderProps {
  set: SpeakingSet;
}

type Phase = "prep" | "recording" | "processing" | "done";

export function SpeakingRecorder({ set }: SpeakingRecorderProps) {
  const prompts = (set.prompts as string[]) ?? [];
  const [phase, setPhase] = useState<Phase>("prep");
  const [prepLeft, setPrepLeft] = useState(set.prepTimeSec);
  const [recordLeft, setRecordLeft] = useState(set.speakTimeSec);
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  function clearTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  async function startPrep() {
    setPhase("prep");
    setPrepLeft(set.prepTimeSec);
    intervalRef.current = setInterval(() => {
      setPrepLeft((t) => {
        if (t <= 1) {
          clearTimer();
          startRecording();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
        submitAudio(blob);
      };
      mr.start(100);
      mediaRecorderRef.current = mr;
      setPhase("recording");
      setRecordLeft(set.speakTimeSec);
      intervalRef.current = setInterval(() => {
        setRecordLeft((t) => {
          if (t <= 1) {
            clearTimer();
            stopRecording();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } catch {
      toast.error("Không thể truy cập microphone");
    }
  }

  function stopRecording() {
    clearTimer();
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setPhase("processing");
  }

  async function submitAudio(blob: Blob) {
    const formData = new FormData();
    formData.append("audio", blob, "recording.webm");
    formData.append("setId", set.id);
    formData.append("taskType", set.taskType);
    formData.append("level", set.topikLevel);
    formData.append("speechLevel", set.speechLevel);

    try {
      const res = await fetch("/api/grade/speaking", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setFeedback(data.feedback);
      setPhase("done");
    } catch {
      toast.error("Lỗi khi xử lý bài nói. Vui lòng thử lại.");
      setPhase("prep");
    }
  }

  function reset() {
    clearTimer();
    setPhase("prep");
    setPrepLeft(set.prepTimeSec);
    setRecordLeft(set.speakTimeSec);
    setFeedback(null);
    setAudioUrl(null);
  }

  return (
    <div className="space-y-4">
      {/* Prompts */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Câu hỏi / Chủ đề</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {prompts.map((p, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <span className="text-muted-foreground font-bold">{i + 1}.</span>
              <span className="hangul-text">{p}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recorder */}
      <Card>
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {phase === "prep" && !feedback && (
              <motion.div
                key="prep-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-4"
              >
                <div className="text-5xl">🎤</div>
                <p className="text-muted-foreground text-sm">
                  Khi bấm bắt đầu, bạn có <strong>{set.prepTimeSec} giây</strong> chuẩn bị,
                  sau đó tự động ghi âm <strong>{set.speakTimeSec} giây</strong>.
                </p>
                <Button size="lg" onClick={startPrep}>
                  <Mic className="mr-2 h-5 w-5" />
                  Bắt đầu luyện nói
                </Button>
              </motion.div>
            )}

            {phase === "prep" && prepLeft < set.prepTimeSec && (
              <motion.div
                key="countdown"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-4"
              >
                <p className="text-muted-foreground">Thời gian chuẩn bị</p>
                <div className="text-6xl font-bold text-amber-500">{prepLeft}</div>
                <Progress value={((set.prepTimeSec - prepLeft) / set.prepTimeSec) * 100} />
              </motion.div>
            )}

            {phase === "recording" && (
              <motion.div
                key="recording"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="inline-flex p-4 bg-red-100 rounded-full"
                >
                  <Mic className="h-8 w-8 text-red-600" />
                </motion.div>
                <p className="text-red-600 font-semibold">Đang ghi âm...</p>
                <div className="text-4xl font-bold font-mono">{recordLeft}s</div>
                <Progress value={((set.speakTimeSec - recordLeft) / set.speakTimeSec) * 100} className="[&>div]:bg-red-500" />
                <Button variant="outline" onClick={stopRecording}>
                  <Square className="mr-2 h-4 w-4" />
                  Dừng sớm
                </Button>
              </motion.div>
            )}

            {phase === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-3"
              >
                <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
                <p className="font-medium">AI đang phân tích bài nói của bạn...</p>
                <p className="text-sm text-muted-foreground">Deepgram transcription + Claude grading</p>
              </motion.div>
            )}

            {phase === "done" && feedback && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Overall score */}
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600">{feedback.score}</div>
                  <p className="text-muted-foreground">/ 100</p>
                </div>

                {/* Criteria */}
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(feedback.criteria).map(([key, crit]) => {
                    const labels: Record<string, string> = {
                      pronunciation: "Phát âm",
                      speechLevel: "Kính ngữ",
                      grammar: "Ngữ pháp",
                      fluency: "Lưu loát",
                    };
                    return (
                      <div key={key} className="bg-zinc-50 rounded-lg p-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{labels[key]}</span>
                          <span className="font-bold">{crit.score}</span>
                        </div>
                        <Progress value={crit.score} className="h-1.5" />
                      </div>
                    );
                  })}
                </div>

                {/* Transcript */}
                {feedback.transcript && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Transcript AI nghe được:</p>
                    <p className="text-sm hangul-text">{feedback.transcript}</p>
                  </div>
                )}

                {/* Overall feedback */}
                <div className="bg-zinc-50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Nhận xét tổng quát:</p>
                  <p className="text-sm">{feedback.overallFeedback}</p>
                </div>

                {/* Audio playback */}
                {audioUrl && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Nghe lại bài nói:</p>
                    <audio src={audioUrl} controls className="w-full" />
                  </div>
                )}

                <Button variant="outline" className="w-full" onClick={reset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Thử lại
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
