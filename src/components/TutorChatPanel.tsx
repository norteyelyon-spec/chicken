import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Bot,
  FilePlus,
  GraduationCap,
  Lightbulb,
  Maximize2,
  MessageSquare,
  Mic,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  Square,
  X,
} from 'lucide-react';
import { SUBJECTS, SYLLABUS_TOPICS } from '../data/subjects';
import type {
  GradeLevel,
  StudyNote,
  SubjectId,
  SyllabusTopic,
  TeachingLaunchTarget,
  TutorMessage,
  TutorPanelMode,
  TutorQuestionContext,
  TutorRecommendation,
  TutorStudentContextPayload,
} from '../types';
import type { LiveVoiceName } from '../utils/liveAudio';
import { buildTutorPromptChips } from '../utils/tutorContext';
import { AITeachingStudio } from './AITeachingStudio';
import { LiveVoiceTutor } from './LiveVoiceTutor';
import { MarkdownPreview, MathText } from './MathText';

interface TutorChatPanelProps {
  variant: 'full' | 'drawer';
  messages: TutorMessage[];
  isStreaming: boolean;
  errorBanner: string | null;
  studentContext: TutorStudentContextPayload;
  activeQuestion: TutorQuestionContext | null;
  mode?: TutorPanelMode;
  onChangeMode?: (mode: TutorPanelMode) => void;
  teachingLaunchTarget?: TeachingLaunchTarget | null;
  onConsumeTeachingLaunchTarget?: () => void;
  onSaveLessonAsNote?: (note: StudyNote) => void;
  onSendMessage: (promptText: string) => void;
  onStopStreaming: () => void;
  onClearChat: () => void;
  onClearActiveQuestion: () => void;
  onPracticeTopic: (subject: SubjectId, grade: GradeLevel, topicId: string) => void;
  onOpenTopicInHub: (subject: SubjectId, grade: GradeLevel) => void;
  onCreateNoteForTopic: (topic: SyllabusTopic) => void;
  onCloseDrawer?: () => void;
  onExpandToFull?: () => void;
}

export const TutorChatPanel: React.FC<TutorChatPanelProps> = ({
  variant,
  messages,
  isStreaming,
  errorBanner,
  studentContext,
  activeQuestion,
  mode: controlledMode,
  onChangeMode,
  teachingLaunchTarget,
  onConsumeTeachingLaunchTarget,
  onSaveLessonAsNote,
  onSendMessage,
  onStopStreaming,
  onClearChat,
  onClearActiveQuestion,
  onPracticeTopic,
  onOpenTopicInHub,
  onCreateNoteForTopic,
  onCloseDrawer,
  onExpandToFull,
}) => {
  const [internalMode, setInternalMode] = useState<TutorPanelMode>('chat');
  const mode = controlledMode ?? internalMode;
  const setMode = (nextMode: TutorPanelMode) => {
    setInternalMode(nextMode);
    onChangeMode?.(nextMode);
  };

  const [liveLessonContext, setLiveLessonContext] = useState<{
    topicTitle: string;
    stageTitle?: string;
    explanation?: string;
    voiceName?: LiveVoiceName;
  } | null>(null);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const promptChips = buildTutorPromptChips(studentContext);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (messages.length === 0) {
      el.scrollTop = 0;
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isStreaming]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || isStreaming) return;
    setDraft('');
    onSendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleAskAboutRecommendation = (rec: TutorRecommendation) => {
    const subName = SUBJECTS[rec.subject]?.name ?? rec.subject;
    onSendMessage(
      `Explain the GES ${rec.grade} ${subName} unit "${rec.unitNumber}: ${rec.title}" (${rec.reason}). Give me the core principles, key formulas, and 1 quick WASSCE check question.`
    );
  };

  const handleCreateNoteFromRec = (rec: TutorRecommendation) => {
    const found = SYLLABUS_TOPICS.find((t) => t.id === rec.topicId);
    if (found) {
      onCreateNoteForTopic(found);
      onCloseDrawer?.();
    }
  };

  const chatPane = (
    <div
      className={`flex flex-col bg-slate-900/90 border border-slate-800/90 overflow-hidden ${
        variant === 'full' ? 'rounded-2xl h-[calc(100vh-11.5rem)] min-h-[540px]' : 'h-full rounded-none sm:rounded-l-2xl'
      }`}
    >
      {/* Top Bar */}
      <div className="px-4 sm:px-5 py-3.5 border-b border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="font-display text-sm font-bold text-white truncate">
              WASSCE AI Study Tutor
            </div>
            <div className="text-[11px] text-slate-400 truncate tabular-nums">
              {studentContext.gradeLevel} · {studentContext.overallAccuracy}% accuracy ·{' '}
              {studentContext.pendingMistakes.length} pending mistakes
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 shrink-0 max-w-full">
          <div
            className="inline-flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-[11px]"
            role="group"
            aria-label="Tutor interaction mode"
          >
            <button
              type="button"
              onClick={() => setMode('chat')}
              aria-pressed={mode === 'chat'}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-colors whitespace-nowrap shrink-0 ${
                mode === 'chat'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              <span>Chat</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('teach')}
              aria-pressed={mode === 'teach'}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-colors whitespace-nowrap shrink-0 ${
                mode === 'teach'
                  ? 'bg-emerald-400 text-slate-950'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3 h-3" />
              <span>AI Teacher</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('voice')}
              aria-pressed={mode === 'voice'}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-colors whitespace-nowrap shrink-0 ${
                mode === 'voice'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Mic className="w-3 h-3" />
              <span>Voice</span>
            </button>
          </div>

          {mode === 'chat' && messages.length > 0 && (
            <button
              type="button"
              onClick={onClearChat}
              disabled={isStreaming}
              title="Start new conversation"
              aria-label="Clear chat history"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 disabled:opacity-40 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          )}
          {variant === 'drawer' && onExpandToFull && (
            <button
              type="button"
              onClick={onExpandToFull}
              title="Open full AI Tutor workspace"
              aria-label="Open full AI Tutor workspace"
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
          {variant === 'drawer' && onCloseDrawer && (
            <button
              type="button"
              onClick={onCloseDrawer}
              aria-label="Close AI Tutor drawer"
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Attached Question Context Banner */}
      {activeQuestion && (
        <div className="px-4 py-3 bg-cyan-500/8 border-b border-cyan-500/25 flex items-start justify-between gap-3 shrink-0">
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-cyan-300">
              <Lightbulb className="w-3.5 h-3.5 shrink-0" />
              <span>
                Question Context Attached · {SUBJECTS[activeQuestion.subject].shortName}{' '}
                {activeQuestion.grade} ({activeQuestion.paperType === 'mcq' ? 'Paper 1' : 'Paper 2'})
              </span>
            </div>
            <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
              <MathText text={activeQuestion.prompt} />
            </p>
          </div>
          <button
            type="button"
            onClick={onClearActiveQuestion}
            aria-label="Detach question context"
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {mode === 'teach' ? (
        <AITeachingStudio
          variant={variant}
          studentContext={studentContext}
          launchTarget={teachingLaunchTarget}
          onConsumeLaunchTarget={onConsumeTeachingLaunchTarget}
          onSwitchToLiveVoice={(ctx) => {
            setLiveLessonContext(ctx);
            setMode('voice');
          }}
          onSaveLessonAsNote={onSaveLessonAsNote}
          onPracticeTopic={(sub, grade, topicId) => {
            onPracticeTopic(sub, grade, topicId);
            onCloseDrawer?.();
          }}
        />
      ) : mode === 'voice' ? (
        <LiveVoiceTutor
          studentContext={studentContext}
          activeQuestion={activeQuestion}
          compact={variant === 'drawer'}
          initialVoiceName={liveLessonContext?.voiceName}
          lessonContext={liveLessonContext}
          onClearLessonContext={() => setLiveLessonContext(null)}
        />
      ) : (
        <>
          {/* Message Stream */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5"
            aria-live="polite"
          >
            {messages.length === 0 ? (
              <div className="max-w-xl mx-auto py-2 sm:py-6 space-y-4 sm:space-y-6">
                <div className="space-y-2 text-center">
                  <div className="w-11 h-11 rounded-2xl bg-cyan-500/12 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white">
                    {activeQuestion
                      ? `Need a hint on ${activeQuestion.topicTitle}?`
                      : `Akwaaba, ${studentContext.preferredName}! Ask your WASSCE Study Tutor`}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {activeQuestion
                      ? 'I can walk you through the governing formula, give progressive Socratic hints, or explain common WAEC pitfalls for this question.'
                      : 'Aligned with the GES SHS 1–3 syllabus. Ask for concept explanations, Paper 1/2/3 hints, KaTeX derivations, Python/SQL walkthroughs, or switch to Voice for live spoken tutoring.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {promptChips.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => onSendMessage(chip.prompt)}
                      className="text-left p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition-colors space-y-1"
                    >
                      <div className="text-xs font-semibold text-cyan-300">{chip.label}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {chip.prompt}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[92%] sm:max-w-[85%] rounded-2xl px-4 py-3 ${
                        isUser
                          ? 'bg-cyan-500/15 border border-cyan-500/30 text-slate-100'
                          : msg.error
                            ? 'bg-rose-950/40 border border-rose-500/40 text-rose-200'
                            : 'bg-slate-950/85 border border-slate-800 text-slate-200'
                      }`}
                    >
                      {msg.attachedQuestionTitle && isUser && (
                        <div className="text-[11px] font-mono text-cyan-300 mb-1">
                          Re: {msg.attachedQuestionTitle}
                        </div>
                      )}
                      {isUser ? (
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      ) : msg.content ? (
                        <MarkdownPreview content={msg.content} />
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">
                          Analyzing GES syllabus &amp; your progress...
                        </span>
                      )}

                      {!isUser && msg.recommendations && msg.recommendations.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                          <div className="text-[11px] font-semibold text-slate-400">
                            Quick Actions for Your Weakest Units
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {msg.recommendations.slice(0, 2).map((rec) => (
                              <button
                                key={rec.topicId}
                                type="button"
                                onClick={() => {
                                  onPracticeTopic(rec.subject, rec.grade, rec.topicId);
                                  onCloseDrawer?.();
                                }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-cyan-300 transition-colors"
                              >
                                <Play className="w-3 h-3 fill-current" />
                                <span>Practice: {rec.title}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {errorBanner && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-rose-500/12 border border-rose-500/35 text-rose-200 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{errorBanner}</span>
              </div>
            )}
          </div>

          {/* Quick Prompt Strip when conversation already started */}
          {messages.length > 0 && (
            <div className="px-4 py-2 border-t border-slate-800/70 bg-slate-950/40 flex items-center gap-2 overflow-x-auto shrink-0">
              {promptChips.slice(0, 3).map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  disabled={isStreaming}
                  onClick={() => onSendMessage(chip.prompt)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-medium text-slate-300 whitespace-nowrap disabled:opacity-40 transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          {/* Composer */}
          <form
            onSubmit={handleSubmit}
            className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex items-end gap-2.5 shrink-0"
          >
            <label htmlFor={`tutor-input-${variant}`} className="sr-only">
              Ask the WASSCE AI Study Tutor
            </label>
            <textarea
              id={`tutor-input-${variant}`}
              ref={inputRef}
              rows={2}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                activeQuestion
                  ? 'Ask for a hint, formula clue, or step-by-step walkthrough...'
                  : 'Ask about GES topics, formulas, or your study plan...'
              }
              className="flex-1 resize-none px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />

            {isStreaming ? (
              <button
                type="button"
                onClick={onStopStreaming}
                aria-label="Stop response"
                className="px-3.5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-semibold text-xs inline-flex items-center gap-1.5 transition-colors shrink-0 h-10"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label="Send message to AI Tutor"
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-semibold text-xs inline-flex items-center gap-1.5 transition-colors shrink-0 h-10"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask</span>
              </button>
            )}
          </form>
        </>
      )}
    </div>
  );

  if (variant === 'drawer') {
    return chatPane;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8">{chatPane}</div>

      {/* Personalized Recommendations & Mistake Bank Rail */}
      <aside className="lg:col-span-4 space-y-5">
        <div className="rounded-2xl bg-slate-900/85 border border-slate-800/90 p-5 space-y-4">
          <div>
            <h3 className="font-display text-sm font-bold text-white">
              Recommended Next Topics
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked dynamically from your mock scores and Mistake Bank
            </p>
          </div>

          <div className="space-y-3">
            {studentContext.recommendedTopics.map((rec) => {
              const sub = SUBJECTS[rec.subject];
              return (
                <div
                  key={rec.topicId}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className={`font-semibold ${sub.textClass}`}>
                      {sub.shortName} · {rec.grade}
                    </span>
                    <span className="font-mono text-slate-500">{rec.unitNumber}</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white leading-snug">{rec.title}</div>
                    <div className="text-[11px] text-amber-300/90 mt-0.5">{rec.reason}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      disabled={isStreaming}
                      onClick={() => handleAskAboutRecommendation(rec)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-[11px] font-semibold text-cyan-300 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Explain</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onPracticeTopic(rec.subject, rec.grade, rec.topicId)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-medium text-slate-200 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Drill</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCreateNoteFromRec(rec)}
                      title="Create study note for this topic"
                      className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <FilePlus className="w-3 h-3" />
                      <span>Note</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenTopicInHub(rec.subject, rec.grade)}
                      title="View unit in Subject Hub"
                      className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <BookOpen className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Mistake Bank Quick Diagnostics */}
        <div className="rounded-2xl bg-slate-900/85 border border-slate-800/90 p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-sm font-bold text-white">
              Pending Mistake Bank ({studentContext.pendingMistakes.length})
            </h3>
          </div>
          {studentContext.pendingMistakes.length === 0 ? (
            <p className="text-xs text-slate-400">
              No pending missed questions. Challenge yourself with a timed SHS 3 mock!
            </p>
          ) : (
            <div className="space-y-2.5">
              {studentContext.pendingMistakes.map((m) => (
                <button
                  key={m.questionId}
                  type="button"
                  disabled={isStreaming}
                  onClick={() =>
                    onSendMessage(
                      `I missed this ${SUBJECTS[m.subject].shortName} (${m.grade} · ${m.topicTitle}) question ${m.wrongCount} time(s): "${m.prompt}". Please break down the concept step-by-step and tell me how to avoid the trap.`
                    )
                  }
                  className="w-full text-left p-3 rounded-xl bg-slate-950/75 hover:bg-slate-800/75 border border-slate-800 hover:border-rose-500/35 transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`font-semibold ${SUBJECTS[m.subject].textClass}`}>
                      {SUBJECTS[m.subject].shortName} · {m.grade}
                    </span>
                    <span className="text-rose-400 tabular-nums">{m.wrongCount}× missed</span>
                  </div>
                  <div className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    <MathText text={m.prompt} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
