import type { User, TOPIKLevel, SkillType, SpeechLevel } from "@prisma/client";

export type { User, TOPIKLevel, SkillType, SpeechLevel };

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: "LEARNER" | "ADMIN";
}

export interface VocabExercise {
  id: string;
  type: "match" | "translate" | "listen" | "fillBlank" | "sentenceOrder" | "speechLevel" | "conjugation";
  question: string;
  answer: string;
  romaji?: string;
  options?: string[];
  hint?: string;
}

export interface GrammarExercise {
  id: string;
  type: "fillBlank" | "translate" | "speechLevel" | "conjugation";
  question: string;
  answer: string;
  options?: string[];
  hint?: string;
}

export interface HangulCharacter {
  hangul: string;
  romaji: string;
  jamo: string;
  example: string;
  audio?: string;
}

export interface ReadingQuestion {
  id: string;
  type: "MCQ" | "FILL_BLANK" | "TRUE_FALSE";
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface WritingGradeRequest {
  text: string;
  taskId: string;
  taskType: string;
  level: string;
  requireFormal: boolean;
}

export interface SpeakingGradeRequest {
  audioBlob: Blob;
  setId: string;
  taskType: string;
  level: string;
  speechLevel: string;
}
