// Lightweight secure hashing helpers for storing irreversible hashes in IndexedDB.
// Uses Web Crypto API (PBKDF2 with SHA-256) to derive a 256-bit hash with a random salt.

function toHex(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export function isProbablyHashed(value: string) {
  if (!value) return false;
  const parts = value.split("$");
  if (parts.length !== 2) return false;
  const [saltHex, hashHex] = parts;
  const isHex = (s: string) => /^[0-9a-fA-F]+$/.test(s);
  // Salt is 16 bytes -> 32 hex chars. Hash can be truncated; accept between 8 and 64 hex chars (4-32 bytes)
  return isHex(saltHex) && isHex(hashHex) && saltHex.length === 32 && hashHex.length >= 8 && hashHex.length <= 64;
}

// hexOutputLength: number of hex characters to store for the derived hash (default 64). Lower values are less secure.
export async function hashValue(value: string, iterations = 100000, hexOutputLength = 64): Promise<string> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(value),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derived = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256",
    },
    baseKey,
    256
  );

  const derivedHex = toHex(derived);
  const truncated = derivedHex.slice(0, Math.max(8, Math.min(hexOutputLength, derivedHex.length)));
  return `${toHex(salt.buffer)}$${truncated}`;
}

export async function verifyValue(value: string, stored: string, iterations = 100000): Promise<boolean> {
  if (!value || !stored) return false;
  const parts = stored.split("$");
  if (parts.length !== 2) return false;
  const [saltHex, hashHex] = parts;
  try {
    const salt = fromHex(saltHex);
    const enc = new TextEncoder();
    const baseKey = await crypto.subtle.importKey(
      "raw",
      enc.encode(value),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );
    const derived = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
      baseKey,
      256
    );
    const derivedHex = toHex(derived);
    return derivedHex.slice(0, hashHex.length).toLowerCase() === hashHex.toLowerCase();
  } catch {
    return false;
  }
}
