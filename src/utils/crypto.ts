// Cryptographic hash utility for entrance codes (입장번호)
// Ensures entrance codes are never stored in plaintext

const SALT = 'nyang_playground_salt_2026';

export async function hashEntranceCode(code: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${code.trim()}_${SALT}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Generate a random 4-digit entrance code
export function generateEntranceCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// Synchronous fast hash for initial presets fallback
export function fastHash(code: string): string {
  let hash = 0;
  const str = `${code.trim()}_${SALT}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}
