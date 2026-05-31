import Groq from "groq-sdk";

function getGroq() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY! });
}

const WRITING_SYSTEM = `You are a certified TOPIK (Test of Proficiency in Korean) examiner with 10 years of experience grading Korean writing.
You provide accurate, detailed, and constructive feedback in both Korean and English.
Always return valid JSON only — no markdown, no prose outside of JSON.`;

const SPEAKING_SYSTEM = `You are a Korean language speaking coach specializing in TOPIK preparation.
You evaluate Korean speech transcripts and provide actionable phonetic and grammatical feedback.
The learner's native language is Vietnamese — common errors include ㅡ/ㅓ confusion and missing batchim pronunciation.
Always return valid JSON only — no markdown, no prose outside of JSON.`;

export type WritingFeedback = {
  score: number;
  maxScore: number;
  criteria: {
    content: { score: number; maxScore: number; feedback: string };
    grammar: { score: number; maxScore: number; feedback: string; errors: string[] };
    vocabulary: { score: number; maxScore: number; feedback: string; suggestions: string[] };
    formality: { score: number; maxScore: number; feedback: string };
  };
  annotations: Array<{
    original: string;
    issue: string;
    correction: string;
    explanation: string;
  }>;
  correctedVersion: string;
};

export type SpeakingFeedback = {
  score: number;
  criteria: {
    pronunciation: { score: number; errors: Array<{ word: string; issue: string }> };
    speechLevel: { score: number; expected: string; errors: string[] };
    grammar: { score: number; errors: string[] };
    fluency: { score: number; wordsPerMinute: number; fillerCount: number; feedback: string };
  };
  transcript: string;
  overallFeedback: string;
};

export async function gradeWriting(
  text: string,
  level: string,
  taskType: string,
  requireFormal: boolean
): Promise<WritingFeedback> {
  const maxScore = taskType === "TOPIK_53" ? 50 : taskType === "TOPIK_52" ? 30 : 20;
  const groq = getGroq();

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
    max_tokens: 2048,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: WRITING_SYSTEM },
      {
        role: "user",
        content: `Evaluate this Korean writing by a Vietnamese learner at TOPIK Level ${level}.
Task type: ${taskType}
${requireFormal ? "IMPORTANT: This task requires formal written Korean (합쇼체/격식체). Evaluate formality strictly." : "Speech level: any polite form acceptable."}

Text to evaluate:
"""
${text}
"""

Return JSON matching this exact schema:
{
  "score": <number 0-${maxScore}>,
  "maxScore": ${maxScore},
  "criteria": {
    "content":    { "score": <0-${Math.round(maxScore * 0.24)}>, "maxScore": ${Math.round(maxScore * 0.24)}, "feedback": "<string>" },
    "grammar":    { "score": <0-${Math.round(maxScore * 0.28)}>, "maxScore": ${Math.round(maxScore * 0.28)}, "feedback": "<string>", "errors": ["<error>"] },
    "vocabulary": { "score": <0-${Math.round(maxScore * 0.28)}>, "maxScore": ${Math.round(maxScore * 0.28)}, "feedback": "<string>", "suggestions": ["<suggestion>"] },
    "formality":  { "score": <0-${Math.round(maxScore * 0.20)}>, "maxScore": ${Math.round(maxScore * 0.20)}, "feedback": "<string>" }
  },
  "annotations": [
    { "original": "<original text>", "issue": "<issue>", "correction": "<corrected>", "explanation": "<why>" }
  ],
  "correctedVersion": "<fully corrected text>"
}`,
      },
    ],
  });

  const raw = completion.choices[0].message.content ?? "{}";
  return JSON.parse(raw) as WritingFeedback;
}

export async function gradeSpeaking(
  transcript: string,
  level: string,
  speechLevel: "FORMAL" | "POLITE" | "INFORMAL",
  taskType: string
): Promise<SpeakingFeedback> {
  const speechLevelLabel =
    speechLevel === "FORMAL" ? "합쇼체" : speechLevel === "POLITE" ? "해요체" : "반말";
  const groq = getGroq();

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
    max_tokens: 2048,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SPEAKING_SYSTEM },
      {
        role: "user",
        content: `Evaluate this transcript of a Vietnamese learner speaking Korean at TOPIK Level ${level}.
Expected speech level: ${speechLevel} (${speechLevelLabel}).
Task type: ${taskType}

Transcript:
"""
${transcript}
"""

Return JSON matching this exact schema:
{
  "score": <0-100>,
  "criteria": {
    "pronunciation": { "score": <0-100>, "errors": [{ "word": "<word>", "issue": "<description>" }] },
    "speechLevel":   { "score": <0-100>, "expected": "${speechLevelLabel}", "errors": ["<example of wrong form used>"] },
    "grammar":       { "score": <0-100>, "errors": ["<grammar error description>"] },
    "fluency":       { "score": <0-100>, "wordsPerMinute": <number>, "fillerCount": <number>, "feedback": "<string>" }
  },
  "transcript": "${transcript}",
  "overallFeedback": "<2-3 sentence summary in English>"
}`,
      },
    ],
  });

  const raw = completion.choices[0].message.content ?? "{}";
  return JSON.parse(raw) as SpeakingFeedback;
}

export async function getVocabFeedback(
  word: string,
  userAnswer: string,
  correctAnswer: string
): Promise<string> {
  const groq = getGroq();

  const completion = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    temperature: 0.5,
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: `A Vietnamese learner answered "${userAnswer}" for the Korean word "${word}".
The correct answer is "${correctAnswer}".
Give a short, encouraging 1-sentence tip in Vietnamese to help them remember this word.`,
      },
    ],
  });

  return completion.choices[0].message.content ?? "";
}
