/**
 * Korean Hangul Decomposition & Dubeolsik Keyboard / Finger Mapping
 */

export type FingerId =
  | 'LP' // Left Pinky (왼손 새끼)
  | 'LR' // Left Ring (왼손 약지)
  | 'LM' // Left Middle (왼손 중지)
  | 'LI' // Left Index (왼손 검지)
  | 'LT' // Left Thumb (왼손 엄지)
  | 'RT' // Right Thumb (오른손 엄지)
  | 'RI' // Right Index (오른손 검지)
  | 'RM' // Right Middle (오른손 중지)
  | 'RR' // Right Ring (오른손 약지)
  | 'RP'; // Right Pinky (오른손 새끼)

export interface KeyGuideInfo {
  jamo: string;
  keyId: string;
  charLabel: string;
  finger: FingerId;
  fingerName: string;
  requiresShift: boolean;
  isTypo?: boolean;
}

// Finger Korean Display Names
export const FINGER_NAMES: Record<FingerId, string> = {
  LP: '왼손 새끼손가락',
  LR: '왼손 약손가락',
  LM: '왼손 가운데손가락(중지)',
  LI: '왼손 집게손가락(검지)',
  LT: '왼손 엄지손가락',
  RT: '오른손 엄지손가락',
  RI: '오른손 집게손가락(검지)',
  RM: '오른손 가운데손가락(중지)',
  RR: '오른손 약손가락',
  RP: '오른손 새끼손가락',
};

// Single Jamo to Key & Finger Mapping
export const JAMO_KEY_MAP: Record<string, { keyId: string; finger: FingerId; requiresShift?: boolean }> = {
  // Consonants
  ㅂ: { keyId: 'KeyQ', finger: 'LP' },
  ㅃ: { keyId: 'KeyQ', finger: 'LP', requiresShift: true },
  ㅈ: { keyId: 'KeyW', finger: 'LR' },
  ㅉ: { keyId: 'KeyW', finger: 'LR', requiresShift: true },
  ㄷ: { keyId: 'KeyE', finger: 'LM' },
  ㄸ: { keyId: 'KeyE', finger: 'LM', requiresShift: true },
  ㄱ: { keyId: 'KeyR', finger: 'LI' },
  ㄲ: { keyId: 'KeyR', finger: 'LI', requiresShift: true },
  ㅅ: { keyId: 'KeyT', finger: 'LI' },
  ㅆ: { keyId: 'KeyT', finger: 'LI', requiresShift: true },
  ㅁ: { keyId: 'KeyA', finger: 'LP' },
  ㄴ: { keyId: 'KeyS', finger: 'LR' },
  ㅇ: { keyId: 'KeyD', finger: 'LM' },
  ㄹ: { keyId: 'KeyF', finger: 'LI' },
  ㅎ: { keyId: 'KeyG', finger: 'LI' },
  ㅋ: { keyId: 'KeyZ', finger: 'LP' },
  ㅌ: { keyId: 'KeyX', finger: 'LR' },
  ㅊ: { keyId: 'KeyC', finger: 'LM' },
  ㅍ: { keyId: 'KeyV', finger: 'LI' },

  // Vowels
  ㅛ: { keyId: 'KeyY', finger: 'RI' },
  ㅕ: { keyId: 'KeyU', finger: 'RI' },
  ㅑ: { keyId: 'KeyI', finger: 'RM' },
  ㅐ: { keyId: 'KeyO', finger: 'RR' },
  ㅒ: { keyId: 'KeyO', finger: 'RR', requiresShift: true },
  ㅔ: { keyId: 'KeyP', finger: 'RP' },
  ㅖ: { keyId: 'KeyP', finger: 'RP', requiresShift: true },
  ㅗ: { keyId: 'KeyH', finger: 'RI' },
  ㅓ: { keyId: 'KeyJ', finger: 'RI' },
  ㅏ: { keyId: 'KeyK', finger: 'RM' },
  ㅣ: { keyId: 'KeyL', finger: 'RR' },
  ㅠ: { keyId: 'KeyB', finger: 'LI' },
  ㅜ: { keyId: 'KeyN', finger: 'RI' },
  ㅡ: { keyId: 'KeyM', finger: 'RI' },

  // Space
  ' ': { keyId: 'Space', finger: 'RT' },
};

const INITIAL_CONSONANTS = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

const VOWEL_DECOMPOSITION: Record<number, string[]> = {
  0: ['ㅏ'],
  1: ['ㅐ'],
  2: ['ㅑ'],
  3: ['ㅒ'],
  4: ['ㅓ'],
  5: ['ㅔ'],
  6: ['ㅕ'],
  7: ['ㅖ'],
  8: ['ㅗ'],
  9: ['ㅗ', 'ㅏ'], // ㅘ
  10: ['ㅗ', 'ㅐ'], // ㅙ
  11: ['ㅗ', 'ㅣ'], // ㅚ
  12: ['ㅛ'],
  13: ['ㅜ'],
  14: ['ㅜ', 'ㅓ'], // ㅝ
  15: ['ㅜ', 'ㅔ'], // ㅞ
  16: ['ㅜ', 'ㅣ'], // ㅟ
  17: ['ㅠ'],
  18: ['ㅡ'],
  19: ['ㅡ', 'ㅣ'], // ㅢ
  20: ['ㅣ'],
};

const FINAL_DECOMPOSITION: Record<number, string[]> = {
  0: [],
  1: ['ㄱ'],
  2: ['ㄲ'],
  3: ['ㄱ', 'ㅅ'], // ㄳ
  4: ['ㄴ'],
  5: ['ㄴ', 'ㅈ'], // ㄵ
  6: ['ㄴ', 'ㅎ'], // ㄶ
  7: ['ㄷ'],
  8: ['ㄹ'],
  9: ['ㄹ', 'ㄱ'], // ㄺ
  10: ['ㄹ', 'ㅁ'], // ㄻ
  11: ['ㄹ', 'ㅂ'], // ㄼ
  12: ['ㄹ', 'ㅅ'], // ㄽ
  13: ['ㄹ', 'ㅌ'], // ㄾ
  14: ['ㄹ', 'ㅍ'], // ㄿ
  15: ['ㄹ', 'ㅎ'], // ㅀ
  16: ['ㅁ'],
  17: ['ㅂ'],
  18: ['ㅂ', 'ㅅ'], // ㅄ
  19: ['ㅅ'],
  20: ['ㅆ'],
  21: ['ㅇ'],
  22: ['ㅈ'],
  23: ['ㅊ'],
  24: ['ㅋ'],
  25: ['ㅌ'],
  26: ['ㅍ'],
  27: ['ㅎ'],
};

/**
 * Decomposes a Korean text string into its exact sequence of atomic keystrokes
 */
export function decomposeToKeystrokes(text: string): string[] {
  const result: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = char.charCodeAt(0);

    // If Korean Syllable (가 ~ 힣)
    if (code >= 0xac00 && code <= 0xd7a3) {
      const syllableIndex = code - 0xac00;
      const initialIdx = Math.floor(syllableIndex / (21 * 28));
      const vowelIdx = Math.floor((syllableIndex % (21 * 28)) / 28);
      const finalIdx = syllableIndex % 28;

      // 1. Initial Consonant
      result.push(INITIAL_CONSONANTS[initialIdx]);

      // 2. Vowel(s)
      const vowels = VOWEL_DECOMPOSITION[vowelIdx] || [];
      result.push(...vowels);

      // 3. Final Consonant(s)
      if (finalIdx > 0) {
        const finals = FINAL_DECOMPOSITION[finalIdx] || [];
        result.push(...finals);
      }
    } else if (JAMO_KEY_MAP[char]) {
      // Single jamo or space
      result.push(char);
    } else {
      // Pass-through other characters like spaces or numbers
      result.push(char);
    }
  }

  return result;
}

/**
 * Given target text and current user input, determine which keystroke comes next.
 * Detects mismatches (typos) and guides Backspace.
 */
export function getNextKeystrokeGuide(targetText: string, currentInput: string): KeyGuideInfo | null {
  const targetKeystrokes = decomposeToKeystrokes(targetText);
  const inputKeystrokes = decomposeToKeystrokes(currentInput);

  // Check prefix match
  let hasMismatch = false;
  for (let i = 0; i < inputKeystrokes.length; i++) {
    if (i >= targetKeystrokes.length || inputKeystrokes[i] !== targetKeystrokes[i]) {
      hasMismatch = true;
      break;
    }
  }

  if (hasMismatch) {
    return {
      jamo: '지우개(⌫)',
      keyId: 'Backspace',
      charLabel: 'Backspace',
      finger: 'RP',
      fingerName: '오른손 새끼손가락',
      requiresShift: false,
      isTypo: true,
    };
  }

  // If user has matched everything so far
  if (inputKeystrokes.length >= targetKeystrokes.length) {
    return null;
  }

  const nextJamo = targetKeystrokes[inputKeystrokes.length];
  const mapping = JAMO_KEY_MAP[nextJamo];

  if (!mapping) {
    return null;
  }

  return {
    jamo: nextJamo,
    keyId: mapping.keyId,
    charLabel: nextJamo,
    finger: mapping.finger,
    fingerName: FINGER_NAMES[mapping.finger],
    requiresShift: Boolean(mapping.requiresShift),
    isTypo: false,
  };
}
