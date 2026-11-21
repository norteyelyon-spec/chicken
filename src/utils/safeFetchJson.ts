import { extractTutorErrorMessage } from './tutorContext.ts';

export interface SafeJsonResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  errorMessage?: string;
}

function looksLikeHtml(raw: string): boolean {
  const head = raw.trim().slice(0, 80).toLowerCase();
  return head.startsWith('<!doctype') || head.startsWith('<html') || head.startsWith('<head') || head.startsWith('<body');
}

export async function safeParseResponseJson<T>(
  response: Pick<Response, 'ok' | 'status' | 'statusText' | 'text' | 'headers'>
): Promise<SafeJsonResult<T>> {
  let rawText = '';
  try {
    rawText = await response.text();
  } catch {
    return {
      ok: false,
      status: response.status || 500,
      data: null,
      errorMessage: extractTutorErrorMessage(response.status || 500, response.statusText),
    };
  }

  const trimmed = rawText.trim();
  const contentType = response.headers?.get?.('content-type') ?? '';

  if (trimmed && !looksLikeHtml(trimmed) && (contentType.includes('json') || trimmed.startsWith('{') || trimmed.startsWith('['))) {
    try {
      const parsed = JSON.parse(trimmed) as T & { error?: string; message?: string };
      if (!response.ok) {
        const msg =
          typeof (parsed as { error?: unknown }).error === 'string'
            ? (parsed as { error: string }).error
            : typeof (parsed as { message?: unknown }).message === 'string'
              ? (parsed as { message: string }).message
              : response.statusText;
        return {
          ok: false,
          status: response.status,
          data: parsed,
          errorMessage: extractTutorErrorMessage(response.status, msg),
        };
      }
      return {
        ok: true,
        status: response.status,
        data: parsed,
      };
    } catch {
      // Fall through cleanly without exposing raw JSON syntax crash
    }
  }

  if (looksLikeHtml(trimmed)) {
    const htmlStatusMsg =
      response.status === 404
        ? 'The requested AI Tutor endpoint was not found (HTML page returned). Please refresh or restart the server.'
        : response.status === 502 || response.status === 503 || response.status === 504
          ? 'The AI Tutor service timed out or is temporarily busy. Please retry in a few seconds.'
          : 'Received an unexpected HTML response instead of JSON from the AI Tutor server. Please retry.';
    return {
      ok: false,
      status: response.status || 502,
      data: null,
      errorMessage: htmlStatusMsg,
    };
  }

  return {
    ok: false,
    status: response.status || 500,
    data: null,
    errorMessage: extractTutorErrorMessage(
      response.status || 500,
      trimmed && trimmed.length < 220 ? trimmed : response.statusText || 'Invalid JSON response from server.'
    ),
  };
}
