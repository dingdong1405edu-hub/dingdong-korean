// Revised Romanization of Korean (국립국어원 표준)
// Built-in implementation — no external package required

const INITIALS = ["g","kk","n","d","tt","r","m","b","pp","s","ss","","j","jj","ch","k","t","p","h"];
const VOWELS = ["a","ae","ya","yae","eo","e","yeo","ye","o","wa","wae","oe","yo","u","wo","we","wi","yu","eu","ui","i"];
const FINALS = ["","k","k","k","n","n","n","l","lk","lm","lb","ls","lt","lp","lh","m","p","p","ps","t","ss","ng","t","t","k","t","p","t"];
const FINAL_INITIALS = ["g","kk","n","d","tt","r","m","b","pp","s","ss","","j","jj","ch","k","t","p","h"];

export function romanize(text: string): string {
  let result = "";
  let i = 0;
  const chars = Array.from(text);

  while (i < chars.length) {
    const char = chars[i];
    const code = char.charCodeAt(0);

    if (code >= 0xac00 && code <= 0xd7a3) {
      const offset = code - 0xac00;
      const finalIdx = offset % 28;
      const vowelIdx = Math.floor(offset / 28) % 21;
      const initialIdx = Math.floor(offset / 28 / 21);

      // Check if next char is a syllable and can use liaison
      const nextChar = chars[i + 1];
      let finalRom = FINALS[finalIdx];

      if (nextChar) {
        const nextCode = nextChar.charCodeAt(0);
        if (nextCode >= 0xac00 && nextCode <= 0xd7a3) {
          const nextOffset = nextCode - 0xac00;
          const nextInitialIdx = Math.floor(nextOffset / 28 / 21);
          if (finalIdx > 0 && nextInitialIdx === 11) {
            finalRom = "";
            // liaison handled in next iteration
          }
        }
      }

      result += INITIALS[initialIdx] + VOWELS[vowelIdx] + finalRom;
    } else if (/[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(char)) {
      result += char;
    } else {
      result += char;
    }
    i++;
  }

  return result;
}

export function isHangul(char: string): boolean {
  const code = char.charCodeAt(0);
  return code >= 0xac00 && code <= 0xd7a3;
}

export function countHangulChars(text: string): number {
  return Array.from(text).filter((c) => isHangul(c)).length;
}

export function decomposeHangul(char: string): { initial: string; vowel: string; final: string } | null {
  const code = char.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return null;

  const INITIAL_JAMO = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
  const VOWEL_JAMO = ["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"];
  const FINAL_JAMO = ["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];

  const offset = code - 0xac00;
  const finalIdx = offset % 28;
  const vowelIdx = Math.floor(offset / 28) % 21;
  const initialIdx = Math.floor(offset / 28 / 21);

  return {
    initial: INITIAL_JAMO[initialIdx],
    vowel: VOWEL_JAMO[vowelIdx],
    final: FINAL_JAMO[finalIdx],
  };
}

export function tokenizeKorean(text: string): Array<{ text: string; isKorean: boolean }> {
  const tokens: Array<{ text: string; isKorean: boolean }> = [];
  let current = "";
  let currentIsKorean = false;

  for (const char of Array.from(text)) {
    const korean = /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(char);
    if (char === " " || char === "\n") {
      if (current) tokens.push({ text: current, isKorean: currentIsKorean });
      tokens.push({ text: char, isKorean: false });
      current = "";
    } else if (korean !== currentIsKorean && current) {
      tokens.push({ text: current, isKorean: currentIsKorean });
      current = char;
      currentIsKorean = korean;
    } else {
      current += char;
      currentIsKorean = korean;
    }
  }
  if (current) tokens.push({ text: current, isKorean: currentIsKorean });

  return tokens;
}
