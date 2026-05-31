import { createClient } from "@deepgram/sdk";

export async function transcribeAudio(audioBuffer: Buffer, mimeType: string): Promise<string> {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);
  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(audioBuffer, {
    model: "nova-2",
    language: "ko",
    punctuate: true,
    smart_format: true,
    filler_words: true,
  });

  if (error) throw new Error(`Deepgram error: ${error.message}`);

  const transcript =
    result?.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? "";
  return transcript;
}
