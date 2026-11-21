const utf8Encoder = new TextEncoder();

export function getUtf8ByteLength(value: string): number {
  return utf8Encoder.encode(value).length;
}

export function clampUtf8String(value: string, maxBytes: number, fallback = ''): string {
  const trimmed = (value ?? '').trim();
  if (!trimmed) return fallback;
  if (utf8Encoder.encode(trimmed).length <= maxBytes) {
    return trimmed;
  }

  let result = '';
  let byteCount = 0;
  for (const ch of trimmed) {
    const chBytes = utf8Encoder.encode(ch).length;
    if (byteCount + chBytes > maxBytes) {
      break;
    }
    result += ch;
    byteCount += chBytes;
  }

  const normalized = result.trim();
  return normalized.length > 0 ? normalized : fallback;
}

export function sanitizeFirestoreId(
  rawId: string,
  fallbackPrefix = 'item',
  allowColon = false
): string {
  const pattern = allowColon ? /[^a-zA-Z0-9_:-]/g : /[^a-zA-Z0-9_-]/g;
  const cleaned = (rawId ?? '').trim().replace(pattern, '_').slice(0, 128);
  return cleaned.length > 0 ? cleaned : `${fallbackPrefix}-${Date.now()}`;
}

export function sanitizeEmailAddress(rawEmail: string, fallback = 'student@wassce.edu.gh'): string {
  const trimmed = clampUtf8String(rawEmail, 254, fallback);
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed) ? trimmed : fallback;
}

