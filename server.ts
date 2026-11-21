import 'dotenv/config';
import express from 'express';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  GoogleGenAI,
  Modality,
  ThinkingLevel,
  Type,
  type GenerateContentResponse,
  type LiveServerMessage,
} from '@google/genai';
import { WebSocketServer, type WebSocket as WsSocket } from 'ws';
import type {
  GradeLevel,
  SubjectId,
  TeachingActionKind,
  TeachingLessonPlan,
  TeachingStep,
  TeachingStyle,
  TutorStudentContextPayload,
} from './src/types/index.ts';
import {
  buildTeachingInteractPrompt,
  buildTeachingSessionPrompt,
  formatTextForSpeech,
  normalizeInteractionFeedback,
  normalizeLessonPlanResponse,
} from './src/utils/aiTeaching.ts';
import { buildLiveTutorInstruction, isValidLiveVoice } from './src/utils/liveAudio.ts';
import { buildTutorSystemInstruction } from './src/utils/tutorContext.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODEL_NAME = 'gemini-4-hydrogen';
const TTS_MODEL_NAME = 'gemini-3.8-flash-lite-tts';
const TRANSCRIBE_MODEL_NAME = 'gemini-3.5-transcribe';
const LIVE_MODEL_NAME = 'gemini-3.8-live';

interface ChatInputMessage {
  role: 'user' | 'assistant';
  content: string;
}

function createGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function parseApiError(err: unknown): { status: number; message: string } {
  const anyErr = err as { status?: number; statusCode?: number; message?: string };
  let rawMessage = anyErr?.message ?? 'Unexpected Gemini API error.';
  try {
    const parsedJson = JSON.parse(rawMessage) as { error?: { message?: string; code?: number } };
    if (parsedJson?.error?.message) {
      rawMessage = parsedJson.error.message;
    }
  } catch {
    // rawMessage is plain text
  }
  let status = Number(anyErr?.status || anyErr?.statusCode || 500);
  if (!Number.isFinite(status) || status < 400 || status > 599) {
    status = 500;
  }
  if (/Unexpected token '<'|<!doctype|<html|not valid JSON/i.test(rawMessage)) {
    rawMessage =
      'AI Tutor upstream returned an unexpected HTML response instead of JSON. Please check your Gemini API key or retry in a few seconds.';
    if (status === 500) status = 502;
  }
  if (/API_KEY_INVALID|PERMISSION_DENIED|API key not valid/i.test(anyErr?.message ?? rawMessage)) {
    status = 403;
  } else if (/RESOURCE_EXHAUSTED|429/i.test(rawMessage)) {
    status = 429;
  } else if (/UNAVAILABLE|503|high demand|overloaded/i.test(rawMessage)) {
    status = 503;
  } else if (/NOT_FOUND/i.test(rawMessage)) {
    status = 404;
  }
  return { status, message: rawMessage };
}

function isRetryableGeminiError(err: unknown): boolean {
  const parsed = parseApiError(err);
  if (/exceeded your current quota|billing details|quota exceeded/i.test(parsed.message)) {
    return false;
  }
  if ([429, 500, 502, 503, 504].includes(parsed.status)) {
    return true;
  }
  return /UNAVAILABLE|RESOURCE_EXHAUSTED|high demand|overloaded|timed out|ECONNRESET|ETIMEDOUT/i.test(
    parsed.message
  );
}

async function withGeminiRetry<T>(operation: () => Promise<T>, maxAttempts = 3): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (err) {
      lastError = err;
      if (attempt >= maxAttempts || !isRetryableGeminiError(err)) {
        throw err;
      }
      const delayMs = 450 * attempt + Math.floor(Math.random() * 250);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw lastError;
}

function parseJsonModelText(raw: string | undefined): Record<string, unknown> {
  const trimmed = (raw ?? '{}').trim();
  if (/^\s*<!doctype|^\s*<html/i.test(trimmed)) {
    throw new Error('AI Tutor upstream returned an HTML error page instead of JSON.');
  }
  const stripped = trimmed
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  try {
    return JSON.parse(stripped || '{}') as Record<string, unknown>;
  } catch {
    const startIdx = stripped.indexOf('{');
    const endIdx = stripped.lastIndexOf('}');
    if (startIdx !== -1 && endIdx > startIdx) {
      return JSON.parse(stripped.slice(startIdx, endIdx + 1)) as Record<string, unknown>;
    }
    throw new Error('AI Tutor model returned malformed JSON. Please retry.');
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '8mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      model: MODEL_NAME,
      hasApiKey: Boolean(process.env.GEMINI_API_KEY?.trim()),
    });
  });

  app.post('/api/tutor/chat', async (req, res) => {
    const ai = createGeminiClient();
    if (!ai) {
      res.status(400).json({
        error: 'GEMINI_API_KEY is not configured. Please check your API key in Settings > Secrets.',
      });
      return;
    }

    const body = (req.body ?? {}) as {
      messages?: ChatInputMessage[];
      studentContext?: TutorStudentContextPayload;
      stream?: boolean;
    };

    const messages = Array.isArray(body.messages) ? body.messages : [];
    const cleaned = messages.filter(
      (m): m is ChatInputMessage =>
        Boolean(m) &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0
    );

    const lastMessage = cleaned[cleaned.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      res.status(400).json({ error: 'Please enter a valid student question to ask the AI Tutor.' });
      return;
    }

    const systemInstruction = body.studentContext
      ? buildTutorSystemInstruction(body.studentContext)
      : 'You are a helpful Ghanaian WASSCE Science & ICT tutor aligned with the GES SHS 1–3 syllabus.';

    const history = cleaned.slice(0, -1).slice(-14).map((m) => ({
      role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
      parts: [{ text: m.content }],
    }));

    const wantsStream = body.stream !== false;

    try {
      const chat = ai.chats.create({
        model: MODEL_NAME,
        history,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      if (!wantsStream) {
        const response: GenerateContentResponse = await withGeminiRetry(() =>
          chat.sendMessage({
            message: lastMessage.content,
          })
        );
        res.json({ text: response.text ?? '' });
        return;
      }

      const streamResponse = await withGeminiRetry(() =>
        chat.sendMessageStream({
          message: lastMessage.content,
        })
      );

      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();

      for await (const chunk of streamResponse) {
        const c = chunk as GenerateContentResponse;
        const delta = c.text ?? '';
        if (delta) {
          res.write(`data: ${JSON.stringify({ text: delta })}\n\n`);
        }
      }
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (err) {
      const parsed = parseApiError(err);
      if (!res.headersSent) {
        res.status(parsed.status).json({ error: parsed.message });
      } else {
        res.write(`data: ${JSON.stringify({ error: parsed.message })}\n\n`);
        res.end();
      }
    }
  });

  app.post('/api/tutor/teach', async (req, res) => {
    const ai = createGeminiClient();
    if (!ai) {
      res.status(400).json({
        error: 'GEMINI_API_KEY is not configured. Please add your API key in Settings > Secrets.',
      });
      return;
    }

    const body = (req.body ?? {}) as {
      grade?: string;
      noteTitle?: string;
      modelKind?: string;
      protons?: number;
      neutrons?: number;
      electrons?: number;
      elementName?: string;
      elementSymbol?: string;
      massNumber?: number;
      netCharge?: string;
      subshellConfig?: string;
      specialNote?: string;
    };

    const promptText = `You are a Ghanaian WASSCE Senior High School (${body.grade || 'SHS2'}) Chemistry & Physics Master Teacher.
Teach an interactive micro-lesson tailored to what the student currently built in the Atomic Model Workbench:
- Study Note: ${body.noteTitle || 'Atomic Theory'}
- Atomic Model Selected: ${body.modelKind || 'Bohr Quantized'}
- Species Built: ${body.elementName || 'Carbon'} (${body.elementSymbol || 'C'}), Mass Number A=${body.massNumber ?? 12}, Protons Z=${body.protons ?? 6}, Neutrons N=${body.neutrons ?? 6}, Electrons e-=${body.electrons ?? 6}, Net Charge=${body.netCharge ?? '0'}
- Subshell Configuration: ${body.subshellConfig || '1s² 2s² 2p²'}
${body.specialNote ? `- Context: ${body.specialNote}` : ''}

Use clear WASSCE syllabus terminology, LaTeX math wrapped in $...$, and generate 1 authentic 4-option WASSCE multiple-choice knowledge check testing this exact species/model.`;

    try {
      const response = await withGeminiRetry(() =>
        ai.models.generateContent({
          model: MODEL_NAME,
          contents: promptText,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                conceptTitle: { type: Type.STRING },
                explanation: { type: Type.STRING },
                keyEquation: { type: Type.STRING },
                stepByStepDerivation: { type: Type.STRING },
                wassceTip: { type: Type.STRING },
                interactiveQuiz: {
                  type: Type.OBJECT,
                  properties: {
                    prompt: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correctIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING },
                  },
                  required: ['prompt', 'options', 'correctIndex', 'explanation'],
                },
              },
              required: [
                'conceptTitle',
                'explanation',
                'keyEquation',
                'stepByStepDerivation',
                'wassceTip',
                'interactiveQuiz',
              ],
            },
          },
        })
      );

      const parsedJson = parseJsonModelText(response.text);
      res.json(parsedJson);
    } catch (err) {
      const parsed = parseApiError(err);
      res.status(parsed.status).json({ error: parsed.message });
    }
  });

  app.post('/api/tutor/teach-session', async (req, res) => {
    const ai = createGeminiClient();
    if (!ai) {
      res.status(400).json({
        error: 'GEMINI_API_KEY is not configured. Please check your API key in Settings > Secrets.',
      });
      return;
    }

    const body = (req.body ?? {}) as {
      subject?: SubjectId;
      grade?: GradeLevel;
      topicTitle?: string;
      style?: TeachingStyle;
      topicSummary?: string;
      keyFormulas?: string[];
      studentContext?: TutorStudentContextPayload;
    };

    const topicTitle = typeof body.topicTitle === 'string' ? body.topicTitle.trim() : '';
    if (!topicTitle) {
      res.status(400).json({ error: 'Please select or enter a topic to start the interactive lesson.' });
      return;
    }

    const subject: SubjectId = body.subject ?? 'physics';
    const grade: GradeLevel =
      body.grade === 'SHS1' || body.grade === 'SHS2' || body.grade === 'SHS3'
        ? body.grade
        : 'SHS2';
    const style: TeachingStyle =
      body.style === 'step-by-step' || body.style === 'exam-drill' ? body.style : 'socratic';

    const promptText = buildTeachingSessionPrompt({
      subject,
      grade,
      topicTitle,
      style,
      topicSummary: body.topicSummary,
      keyFormulas: Array.isArray(body.keyFormulas) ? body.keyFormulas : undefined,
      studentContext: body.studentContext,
    });

    try {
      const response = await withGeminiRetry(() =>
        ai.models.generateContent({
          model: MODEL_NAME,
          contents: promptText,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                learningObjective: { type: Type.STRING },
                wassceExamTrap: { type: Type.STRING },
                steps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stageTitle: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                      keyEquation: { type: Type.STRING },
                      realWorldExample: { type: Type.STRING },
                      spokenScript: { type: Type.STRING },
                      checkPrompt: { type: Type.STRING },
                      checkOptions: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      correctOptionIndex: { type: Type.INTEGER },
                      hint: { type: Type.STRING },
                      explanationAfterCheck: { type: Type.STRING },
                    },
                    required: [
                      'stageTitle',
                      'explanation',
                      'spokenScript',
                      'checkPrompt',
                      'checkOptions',
                      'correctOptionIndex',
                      'hint',
                      'explanationAfterCheck',
                    ],
                  },
                },
              },
              required: ['learningObjective', 'wassceExamTrap', 'steps'],
            },
          },
        })
      );

      const parsedRaw = parseJsonModelText(response.text);
      const lesson = normalizeLessonPlanResponse(parsedRaw, {
        subject,
        grade,
        topicTitle,
        style,
      });
      res.json({ lesson });
    } catch (err) {
      const parsed = parseApiError(err);
      res.status(parsed.status).json({ error: parsed.message });
    }
  });

  app.post('/api/tutor/teach-interact', async (req, res) => {
    const ai = createGeminiClient();
    if (!ai) {
      res.status(400).json({
        error: 'GEMINI_API_KEY is not configured. Please check your API key in Settings > Secrets.',
      });
      return;
    }

    const body = (req.body ?? {}) as {
      lesson?: Pick<TeachingLessonPlan, 'subject' | 'grade' | 'topicTitle' | 'style'>;
      step?: Pick<
        TeachingStep,
        'stepNumber' | 'stageTitle' | 'explanation' | 'checkPrompt' | 'checkOptions' | 'correctOptionIndex' | 'hint'
      >;
      actionKind?: TeachingActionKind;
      studentInput?: string;
      selectedOptionIndex?: number | null;
      studentName?: string;
    };

    if (!body.lesson?.topicTitle || !body.step?.stageTitle) {
      res.status(400).json({ error: 'Active lesson step context is required.' });
      return;
    }

    const actionKind: TeachingActionKind = body.actionKind ?? 'ask-question';
    const studentInput = typeof body.studentInput === 'string' ? body.studentInput.trim() : '';

    if (
      (actionKind === 'answer-open' || actionKind === 'ask-question') &&
      studentInput.length === 0
    ) {
      res.status(400).json({ error: 'Please type or speak your answer or question first.' });
      return;
    }

    const promptText = buildTeachingInteractPrompt({
      lesson: body.lesson,
      step: body.step,
      actionKind,
      studentInput,
      selectedOptionIndex: body.selectedOptionIndex,
      studentName: body.studentName,
    });

    try {
      const response = await withGeminiRetry(() =>
        ai.models.generateContent({
          model: MODEL_NAME,
          contents: promptText,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                verdict: { type: Type.STRING },
                feedback: { type: Type.STRING },
                misconceptionOrNote: { type: Type.STRING },
                followUpPrompt: { type: Type.STRING },
                readyToAdvance: { type: Type.BOOLEAN },
                spokenFeedback: { type: Type.STRING },
              },
              required: ['verdict', 'feedback', 'followUpPrompt', 'readyToAdvance', 'spokenFeedback'],
            },
          },
        })
      );

      const parsedRaw = parseJsonModelText(response.text);
      const interaction = normalizeInteractionFeedback(
        parsedRaw,
        actionKind === 'answer-mcq' ? 'needs-review' : 'clarification'
      );
      res.json({ interaction });
    } catch (err) {
      const parsed = parseApiError(err);
      res.status(parsed.status).json({ error: parsed.message });
    }
  });

  let ttsQuotaCooldownUntil = 0;

  app.post('/api/tutor/speak', async (req, res) => {
    const body = (req.body ?? {}) as {
      text?: string;
      voiceName?: string;
      style?: string;
    };

    const spokenText = formatTextForSpeech(typeof body.text === 'string' ? body.text : '', 2400);
    if (!spokenText) {
      res.status(400).json({ error: 'Please provide lesson text for the AI Teacher to speak.' });
      return;
    }

    const voiceName = isValidLiveVoice(body.voiceName) ? body.voiceName : 'Zephyr';
    const ai = createGeminiClient();
    if (!ai) {
      res.json({
        fallbackToBrowserSpeech: true,
        reason: 'no-api-key',
        voiceName,
      });
      return;
    }

    if (Date.now() < ttsQuotaCooldownUntil) {
      res.json({
        fallbackToBrowserSpeech: true,
        reason: 'quota',
        voiceName,
      });
      return;
    }

    const speechStyle =
      typeof body.style === 'string' && body.style.trim()
        ? body.style.trim().slice(0, 140)
        : 'Clear, warm, encouraging Ghanaian Senior High School Science and ICT master teacher';

    try {
      const response = await withGeminiRetry(() =>
        ai.models.generateContent({
          model: TTS_MODEL_NAME,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: spokenText,
                  speechMetadata: {
                    style: speechStyle,
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName },
              },
            },
          },
        })
      );

      const parts = response.candidates?.[0]?.content?.parts ?? [];
      const audioPart = parts.find((p) => p.inlineData?.data);
      const base64Audio = audioPart?.inlineData?.data;
      if (!base64Audio) {
        res.json({
          fallbackToBrowserSpeech: true,
          reason: 'empty-audio',
          voiceName,
        });
        return;
      }

      res.json({
        audioBase64: base64Audio,
        mimeType: audioPart?.inlineData?.mimeType || 'audio/wav',
        voiceName,
      });
    } catch (err) {
      const parsed = parseApiError(err);
      const isQuota = parsed.status === 429 || /quota|RESOURCE_EXHAUSTED|rate limit/i.test(parsed.message);
      if (isQuota) {
        ttsQuotaCooldownUntil = Date.now() + 5 * 60 * 1000;
      }
      res.json({
        fallbackToBrowserSpeech: true,
        reason: isQuota ? 'quota' : 'unavailable',
        voiceName,
      });
    }
  });

  app.post('/api/tutor/transcribe', async (req, res) => {
    const ai = createGeminiClient();
    if (!ai) {
      res.json({
        text: '',
        fallbackToBrowserRecognition: true,
        reason: 'no-api-key',
      });
      return;
    }

    const body = (req.body ?? {}) as {
      audioBase64?: string;
      mimeType?: string;
    };

    const audioBase64 = typeof body.audioBase64 === 'string' ? body.audioBase64.trim() : '';
    const mimeType =
      typeof body.mimeType === 'string' && body.mimeType.startsWith('audio/')
        ? body.mimeType
        : 'audio/webm';

    if (!audioBase64) {
      res.status(400).json({ error: 'No recorded audio payload provided.' });
      return;
    }

    try {
      const response = await withGeminiRetry(() =>
        ai.models.generateContent({
          model: TRANSCRIBE_MODEL_NAME,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: audioBase64,
                },
              },
              {
                text: 'Transcribe this Senior High School student response accurately, preserving numbers, units, chemical formulas, and technical terms. Return only the clean transcript.',
              },
            ],
          },
        })
      );

      res.json({ text: (response.text ?? '').trim() });
    } catch (err) {
      const parsed = parseApiError(err);
      res.json({
        text: '',
        fallbackToBrowserRecognition: true,
        reason: parsed.status === 429 ? 'quota' : 'unavailable',
      });
    }
  });

  // Always return JSON for unmatched /api/* routes before SPA HTML fallback
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'API endpoint not found.' });
  });

  // Ensure Express body-parser or unexpected middleware errors on /api/* return JSON, never HTML
  app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.path.startsWith('/api')) {
      const parsed = parseApiError(err);
      if (!res.headersSent) {
        res.status(parsed.status).json({ error: parsed.message });
      }
      return;
    }
    next(err);
  });

  if (process.env.NODE_ENV !== 'production') {
    // When HMR is intentionally disabled (e.g. reverse-proxied iframe preview), serve a clean
    // WebSocket-free /@vite/client module so CSS style injection works without triggering
    // "Error: WebSocket closed without opened." unhandled rejections in the browser.
    if (process.env.ENABLE_HMR !== 'true') {
      app.get('/@vite/client', (_req, res) => {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.send(`
const sheetsMap = new Map();
export function updateStyle(id, content) {
  let style = sheetsMap.get(id);
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('data-vite-dev-id', id);
    style.textContent = content;
    document.head.appendChild(style);
    sheetsMap.set(id, style);
  } else {
    style.textContent = content;
  }
}
export function removeStyle(id) {
  const style = sheetsMap.get(id);
  if (style) {
    style.remove();
    sheetsMap.delete(id);
  }
}
export function createHotContext() {
  return {
    accept() {},
    acceptExports() {},
    dispose() {},
    prune() {},
    invalidate() {},
    decline() {},
    on() {},
    off() {},
    send() {},
    data: {},
  };
}
export function injectQuery(url) {
  return url;
}
export class ErrorOverlay extends HTMLElement {}
export default {};
`);
      });
    }

    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.ENABLE_HMR === 'true',
        watch: process.env.ENABLE_HMR === 'true' ? {} : null,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distDir)) {
      app.use(express.static(distDir));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distDir, 'index.html'));
      });
    }
  }

  const server = http.createServer(app);
  const liveWss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
    if (pathname === '/api/tutor/live') {
      liveWss.handleUpgrade(request, socket, head, (ws) => {
        liveWss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  liveWss.on('connection', (clientWs: WsSocket) => {
    let liveSession: Awaited<ReturnType<GoogleGenAI['live']['connect']>> | null = null;
    let isClosed = false;
    let isConnecting = false;

    const sendJson = (payload: Record<string, unknown>) => {
      if (clientWs.readyState === clientWs.OPEN) {
        clientWs.send(JSON.stringify(payload));
      }
    };

    const closeAll = () => {
      if (isClosed) return;
      isClosed = true;
      if (liveSession) {
        try {
          liveSession.close();
        } catch {
          // ignore close errors
        }
        liveSession = null;
      }
      if (clientWs.readyState === clientWs.OPEN || clientWs.readyState === clientWs.CONNECTING) {
        clientWs.close();
      }
    };

    clientWs.on('message', async (rawData) => {
      if (isClosed) return;
      let msg: {
        type?: string;
        data?: string;
        text?: string;
        voiceName?: string;
        studentContext?: TutorStudentContextPayload;
        lessonContext?: { topicTitle: string; stageTitle?: string; explanation?: string } | null;
      };
      try {
        msg = JSON.parse(rawData.toString());
      } catch {
        return;
      }

      if (msg.type === 'start') {
        if (liveSession || isConnecting) return;
        const ai = createGeminiClient();
        if (!ai) {
          sendJson({
            type: 'error',
            status: 400,
            message: 'GEMINI_API_KEY is not configured. Please check your API key in Settings > Secrets.',
          });
          closeAll();
          return;
        }

        isConnecting = true;
        const voiceName = isValidLiveVoice(msg.voiceName) ? msg.voiceName : 'Zephyr';
        const systemInstruction = msg.studentContext
          ? buildLiveTutorInstruction(msg.studentContext, msg.lessonContext)
          : 'You are a helpful Ghanaian WASSCE Science & ICT voice tutor aligned with the GES SHS 1–3 syllabus.';

        try {
          const session = await ai.live.connect({
            model: LIVE_MODEL_NAME,
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName },
                },
              },
              inputAudioTranscription: {},
              outputAudioTranscription: {},
              systemInstruction,
            },
            callbacks: {
              onopen: () => {
                if (isClosed) return;
                sendJson({ type: 'ready', model: LIVE_MODEL_NAME, voiceName });
              },
              onmessage: (message: LiveServerMessage) => {
                if (isClosed) return;
                const content = message.serverContent;
                if (content?.inputTranscription?.text) {
                  sendJson({ type: 'inputTranscript', text: content.inputTranscription.text });
                }
                if (content?.outputTranscription?.text) {
                  sendJson({ type: 'outputTranscript', text: content.outputTranscription.text });
                }
                for (const part of content?.modelTurn?.parts ?? []) {
                  if (part.inlineData?.data) {
                    sendJson({ type: 'audio', data: part.inlineData.data });
                  }
                }
                if (content?.interrupted) {
                  sendJson({ type: 'interrupted' });
                }
                if (content?.turnComplete) {
                  sendJson({ type: 'turnComplete' });
                }
              },
              onerror: (err: unknown) => {
                const parsed = parseApiError(err);
                sendJson({ type: 'error', status: parsed.status, message: parsed.message });
                closeAll();
              },
              onclose: () => {
                closeAll();
              },
            },
          });

          if (isClosed) {
            session.close();
          } else {
            liveSession = session;
            const kickOff = msg.lessonContext?.topicTitle
              ? `Briefly greet ${msg.studentContext?.preferredName || 'the student'} and start coaching them aloud on ${msg.lessonContext.topicTitle}${msg.lessonContext.stageTitle ? ` (${msg.lessonContext.stageTitle})` : ''}.`
              : `Briefly greet ${msg.studentContext?.preferredName || 'the student'} and invite them to ask or answer a quick WASSCE question aloud.`;
            try {
              session.sendRealtimeInput({ text: kickOff });
            } catch {
              // ignore kick-off send error if stream closed
            }
          }
        } catch (err) {
          const parsed = parseApiError(err);
          sendJson({ type: 'error', status: parsed.status, message: parsed.message });
          closeAll();
        } finally {
          isConnecting = false;
        }
        return;
      }

      if (msg.type === 'audio' && typeof msg.data === 'string' && msg.data.length > 0) {
        if (liveSession) {
          liveSession.sendRealtimeInput({
            audio: {
              data: msg.data,
              mimeType: 'audio/pcm;rate=16000',
            },
          });
        }
        return;
      }

      if (msg.type === 'text' && typeof msg.text === 'string' && msg.text.trim()) {
        if (liveSession) {
          liveSession.sendRealtimeInput({
            text: msg.text.trim(),
          });
        }
        return;
      }

      if (msg.type === 'stop') {
        closeAll();
      }
    });

    clientWs.on('close', () => {
      closeAll();
    });
  });

  const port = Number(process.env.PORT) || 3000;
  server.listen(port, '0.0.0.0', () => {
    console.log(`WASSCE Masterclass server running on http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
