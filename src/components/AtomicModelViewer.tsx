import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Atom,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  GraduationCap,
  Loader2,
  Minus,
  Play,
  Plus,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import {
  analyzeAtomicStructure,
  ATOM_CENTER_X,
  ATOM_CENTER_Y,
  type AtomicModelKind,
  computeAtomicModelFrame,
  WASSCE_ATOM_PRESETS,
} from '../utils/atomicModel';
import type { TeachingInteractionFeedback, TeachingLaunchTarget } from '../types';
import { safeParseResponseJson } from '../utils/safeFetchJson';
import { fetchTutorSpeechAudio, speakWithBrowserSpeech } from '../utils/tutorSpeechClient';
import { MarkdownPreview, MathText } from './MathText';

interface AtomicModelViewerProps {
  grade: 'SHS1' | 'SHS2' | 'SHS3';
  noteTitle: string;
  onAskTutor?: (prompt: string) => void;
  onLaunchAITeacher?: (target: TeachingLaunchTarget) => void;
}

type DiagramId = 'thomson-crt' | 'rutherford-foil' | 'millikan-drop' | 'mass-spec' | 'quantum-orbitals';

interface AITeachResponse {
  conceptTitle: string;
  explanation: string;
  keyEquation: string;
  stepByStepDerivation: string;
  wassceTip: string;
  interactiveQuiz: {
    prompt: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation: string;
  };
}

const MODEL_META: Record<
  AtomicModelKind,
  { label: string; year: string; scientist: string; accent: string; summary: string }
> = {
  'plum-pudding': {
    label: 'Plum Pudding',
    year: '1904',
    scientist: 'J.J. Thomson',
    accent: 'text-rose-300 border-rose-500/40 bg-rose-500/15',
    summary:
      'Uniform diffuse sphere of positive charge with negative electrons embedded inside — predicted α-particles should pass straight through with zero backscattering.',
  },
  rutherford: {
    label: 'Rutherford Nuclear',
    year: '1911',
    scientist: 'Ernest Rutherford',
    accent: 'text-amber-300 border-amber-500/40 bg-amber-500/15',
    summary:
      'Tiny, ultra-dense positively charged nucleus holding protons and neutrons at the center, surrounded by mostly empty space where electrons orbit.',
  },
  bohr: {
    label: 'Bohr Quantized',
    year: '1913',
    scientist: 'Niels Bohr',
    accent: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/15',
    summary:
      'Electrons occupy fixed quantized shells (K, L, M, N) with definite energy; photons are absorbed/emitted only during shell transitions (ΔE = hf).',
  },
};

const DIAGRAM_TABS: { id: DiagramId; label: string }[] = [
  { id: 'thomson-crt', label: 'Thomson CRT (1897)' },
  { id: 'rutherford-foil', label: 'Rutherford Foil (1911)' },
  { id: 'millikan-drop', label: 'Millikan Oil Drop (1909)' },
  { id: 'mass-spec', label: 'Mass Spectrometer' },
  { id: 'quantum-orbitals', label: 's / p / d Orbitals' },
];

export const AtomicModelViewer: React.FC<AtomicModelViewerProps> = ({
  grade,
  noteTitle,
  onAskTutor,
  onLaunchAITeacher,
}) => {
  const [modelKind, setModelKind] = useState<AtomicModelKind>('bohr');
  const [protons, setProtons] = useState(6);
  const [neutrons, setNeutrons] = useState(6);
  const [electrons, setElectrons] = useState(6);
  const [showAlphaOverlay, setShowAlphaOverlay] = useState(true);
  const [photonPulse, setPhotonPulse] = useState<'idle' | 'excited' | 'emitted'>('idle');
  const [activeSubTab, setActiveSubTab] = useState<'viewer' | 'diagrams'>('viewer');
  const [selectedDiagram, setSelectedDiagram] = useState<DiagramId>('thomson-crt');

  // Interactive AI Teaching state
  const [aiTeachLoading, setAiTeachLoading] = useState(false);
  const [aiTeachError, setAiTeachError] = useState<string | null>(null);
  const [aiLesson, setAiLesson] = useState<AITeachResponse | null>(null);
  const [aiQuizChoice, setAiQuizChoice] = useState<number | null>(null);
  const [followUpDraft, setFollowUpDraft] = useState('');
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [followUpFeedback, setFollowUpFeedback] = useState<TeachingInteractionFeedback | null>(null);

  // Voice narration state
  const [isSpeakingAtom, setIsSpeakingAtom] = useState(false);
  const [isLoadingAtomVoice, setIsLoadingAtomVoice] = useState(false);
  const [atomVoiceError, setAtomVoiceError] = useState<string | null>(null);
  const atomAudioRef = useRef<HTMLAudioElement | null>(null);

  // Frame-based transition animation state across Plum Pudding -> Rutherford -> Bohr
  const [animState, setAnimState] = useState<{
    from: AtomicModelKind;
    to: AtomicModelKind;
    progress: number;
    isTransitioning: boolean;
  }>({
    from: 'bohr',
    to: 'bohr',
    progress: 1,
    isTransitioning: false,
  });
  const [isEvolutionPlaying, setIsEvolutionPlaying] = useState(false);
  const rafRef = useRef<number | null>(null);
  const evolutionTimersRef = useRef<number[]>([]);
  const currentModelRef = useRef<AtomicModelKind>('bohr');

  const clearEvolutionTimers = () => {
    for (const id of evolutionTimersRef.current) {
      window.clearTimeout(id);
    }
    evolutionTimersRef.current = [];
  };

  const stopFrameAnimation = () => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopFrameAnimation();
      clearEvolutionTimers();
      if (atomAudioRef.current) {
        try {
          atomAudioRef.current.pause();
        } catch {
          // ignore
        }
        atomAudioRef.current = null;
      }
    };
  }, []);

  const animateModelTransition = (
    targetModel: AtomicModelKind,
    durationMs = 850,
    explicitFrom?: AtomicModelKind
  ) => {
    const startFrom = explicitFrom ?? currentModelRef.current;
    stopFrameAnimation();
    setPhotonPulse('idle');
    setModelKind(targetModel);
    currentModelRef.current = targetModel;

    if (startFrom === targetModel) {
      setAnimState({
        from: targetModel,
        to: targetModel,
        progress: 1,
        isTransitioning: false,
      });
      return;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setAnimState({
        from: targetModel,
        to: targetModel,
        progress: 1,
        isTransitioning: false,
      });
      return;
    }

    const startTime = performance.now();
    setAnimState({
      from: startFrom,
      to: targetModel,
      progress: 0,
      isTransitioning: true,
    });

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(1, elapsed / durationMs);
      if (rawProgress < 1) {
        setAnimState({
          from: startFrom,
          to: targetModel,
          progress: rawProgress,
          isTransitioning: true,
        });
        rafRef.current = window.requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        setAnimState({
          from: targetModel,
          to: targetModel,
          progress: 1,
          isTransitioning: false,
        });
      }
    };

    rafRef.current = window.requestAnimationFrame(tick);
  };

  const handleSelectModel = (nextModel: AtomicModelKind) => {
    clearEvolutionTimers();
    setIsEvolutionPlaying(false);
    animateModelTransition(nextModel, 850);
  };

  const handlePlayEvolution = () => {
    clearEvolutionTimers();
    stopFrameAnimation();
    setIsEvolutionPlaying(true);
    setPhotonPulse('idle');

    // Stage 0: Reset directly to 1904 Plum Pudding starting frame
    setModelKind('plum-pudding');
    currentModelRef.current = 'plum-pudding';
    setAnimState({
      from: 'plum-pudding',
      to: 'plum-pudding',
      progress: 1,
      isTransitioning: false,
    });

    // Stage 1: Plum Pudding (1904) -> Rutherford Nuclear (1911)
    const t1 = window.setTimeout(() => {
      animateModelTransition('rutherford', 950, 'plum-pudding');
    }, 320);

    // Stage 2: Rutherford Nuclear (1911) -> Bohr Quantized (1913)
    const t2 = window.setTimeout(() => {
      animateModelTransition('bohr', 950, 'rutherford');
    }, 1780);

    const t3 = window.setTimeout(() => {
      setIsEvolutionPlaying(false);
    }, 2800);

    evolutionTimersRef.current = [t1, t2, t3];
  };

  const analysis = useMemo(
    () => analyzeAtomicStructure(protons, neutrons, electrons),
    [protons, neutrons, electrons]
  );

  const frame = useMemo(
    () =>
      computeAtomicModelFrame(animState.from, animState.to, animState.progress, analysis, {
        excitedOuter: photonPulse === 'excited',
      }),
    [animState.from, animState.to, animState.progress, analysis, photonPulse]
  );

  const applyPreset = (p: number, n: number, e: number) => {
    setProtons(p);
    setNeutrons(n);
    setElectrons(e);
    setPhotonPulse('idle');
  };

  const triggerExcitation = () => {
    if (electrons === 0) return;
    setPhotonPulse('excited');
    window.setTimeout(() => {
      setPhotonPulse('emitted');
      window.setTimeout(() => setPhotonPulse('idle'), 1400);
    }, 950);
  };

  const handleSpeakAtomLesson = async (spokenText: string) => {
    if (isSpeakingAtom && atomAudioRef.current) {
      atomAudioRef.current.pause();
      atomAudioRef.current.currentTime = 0;
      atomAudioRef.current = null;
      setIsSpeakingAtom(false);
      return;
    }
    setAtomVoiceError(null);
    setIsLoadingAtomVoice(true);
    try {
      const { dataUrl, fallbackToBrowser } = await fetchTutorSpeechAudio({
        text: spokenText,
        voiceName: 'Zephyr',
      });
      if (fallbackToBrowser || !dataUrl) {
        setIsLoadingAtomVoice(false);
        speakWithBrowserSpeech({
          text: spokenText,
          onStart: () => setIsSpeakingAtom(true),
          onEnd: () => setIsSpeakingAtom(false),
          onError: () => setIsSpeakingAtom(false),
        });
        return;
      }
      const audio = new Audio(dataUrl);
      atomAudioRef.current = audio;
      audio.onended = () => {
        if (atomAudioRef.current === audio) {
          atomAudioRef.current = null;
          setIsSpeakingAtom(false);
        }
      };
      setIsLoadingAtomVoice(false);
      setIsSpeakingAtom(true);
      await audio.play();
    } catch (err) {
      setIsLoadingAtomVoice(false);
      setIsSpeakingAtom(false);
      setAtomVoiceError((err as Error).message || 'Could not synthesize teacher voice.');
    }
  };

  const handleSubmitAtomFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = followUpDraft.trim();
    if (!trimmed || !aiLesson || followUpLoading) return;
    setFollowUpLoading(true);
    setAiTeachError(null);
    try {
      const response = await fetch('/api/tutor/teach-interact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson: {
            subject: 'chemistry',
            grade,
            topicTitle: `${analysis.element.name} (${MODEL_META[modelKind].label})`,
            style: 'socratic',
          },
          step: {
            stepNumber: 1,
            stageTitle: aiLesson.conceptTitle,
            explanation: aiLesson.explanation,
            checkPrompt: aiLesson.interactiveQuiz.prompt,
            checkOptions: aiLesson.interactiveQuiz.options,
            correctOptionIndex: aiLesson.interactiveQuiz.correctIndex,
            hint: aiLesson.wassceTip,
          },
          actionKind: 'ask-question',
          studentInput: trimmed,
        }),
      });
      const parsed = await safeParseResponseJson<{
        interaction?: TeachingInteractionFeedback;
        error?: string;
      }>(response);
      if (!parsed.ok || !parsed.data?.interaction) {
        setAiTeachError(parsed.errorMessage || 'Unable to get feedback from AI Teacher.');
        return;
      }
      setFollowUpFeedback(parsed.data.interaction);
      setFollowUpDraft('');
    } catch (err) {
      setAiTeachError((err as Error).message || 'Network error asking AI Teacher.');
    } finally {
      setFollowUpLoading(false);
    }
  };

  const handleTeachWithAI = async () => {
    setAiTeachLoading(true);
    setAiTeachError(null);
    setAtomVoiceError(null);
    setAiQuizChoice(null);
    setFollowUpFeedback(null);
    try {
      const response = await fetch('/api/tutor/teach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          noteTitle,
          modelKind: MODEL_META[modelKind].label,
          protons: analysis.protons,
          neutrons: analysis.neutrons,
          electrons: analysis.electrons,
          elementName: analysis.element.name,
          elementSymbol: analysis.element.symbol,
          massNumber: analysis.massNumber,
          netCharge: analysis.chargeFormatted,
          subshellConfig: analysis.subshellConfig,
          specialNote: analysis.specialNote ?? '',
        }),
      });
      const parsed = await safeParseResponseJson<Partial<AITeachResponse> & { error?: string }>(response);
      if (!parsed.ok || !parsed.data) {
        setAiTeachError(parsed.errorMessage || 'Unable to generate AI interactive lesson.');
        return;
      }
      if (!parsed.data.conceptTitle || !parsed.data.interactiveQuiz) {
        setAiTeachError('Incomplete interactive lesson payload received from AI Tutor.');
        return;
      }
      setAiLesson(parsed.data as AITeachResponse);
    } catch (err) {
      setAiTeachError((err as Error).message || 'Network error requesting AI interactive lesson.');
    } finally {
      setAiTeachLoading(false);
    }
  };

  return (
    <div
      data-testid="atomic-model-viewer"
      className="rounded-2xl bg-slate-950/95 border border-emerald-500/30 p-5 space-y-5 shadow-xl"
    >
      {/* Header & Top Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
            <Atom className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-sm sm:text-base font-bold text-white">
              Interactive Atomic Model Workbench &amp; Nuclide Counter
            </h3>
            <p className="text-xs text-slate-400">
              <MathText text="Toggle Thomson, Rutherford & Bohr models, build atoms/ions ($Z=1\text{–}30$), and inspect key experiments." />
            </p>
          </div>
        </div>

        <div className="inline-flex rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveSubTab('viewer')}
            aria-pressed={activeSubTab === 'viewer'}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeSubTab === 'viewer' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            3-Model SVG Viewer
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('diagrams')}
            aria-pressed={activeSubTab === 'diagrams'}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeSubTab === 'diagrams' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            Experiment Diagrams (5)
          </button>
        </div>
      </div>

      {activeSubTab === 'viewer' ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* Left 7 Cols: Interactive SVG Atomic Stage */}
          <div className="xl:col-span-7 min-w-0 space-y-3">
            {/* Atomic Model Selector Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex flex-wrap gap-1.5" role="group" aria-label="Select atomic model">
                {(['plum-pudding', 'rutherford', 'bohr'] as AtomicModelKind[]).map((kind) => {
                  const meta = MODEL_META[kind];
                  const active = modelKind === kind;
                  return (
                    <button
                      key={kind}
                      type="button"
                      onClick={() => handleSelectModel(kind)}
                      aria-pressed={active}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                        active
                          ? meta.accent
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {meta.label} ({meta.year})
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePlayEvolution}
                  disabled={isEvolutionPlaying}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 text-[11px] font-semibold transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isEvolutionPlaying ? 'Evolving 1904→1913...' : 'Play Evolution'}</span>
                </button>

                {modelKind === 'rutherford' && (
                  <button
                    type="button"
                    onClick={() => setShowAlphaOverlay((v) => !v)}
                    aria-pressed={showAlphaOverlay}
                    className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-colors whitespace-nowrap ${
                      showAlphaOverlay
                        ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {showAlphaOverlay ? 'α-Rays: ON' : 'α-Rays: OFF'}
                  </button>
                )}

                {modelKind === 'bohr' && (
                  <button
                    type="button"
                    onClick={triggerExcitation}
                    disabled={electrons === 0 || animState.isTransitioning}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-200 text-[11px] font-semibold transition-colors disabled:opacity-40 whitespace-nowrap"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Excite e⁻ / Emit Photon</span>
                  </button>
                )}
              </div>
            </div>

            {/* Interactive SVG Canvas */}
            <div className="rounded-2xl border border-slate-800 bg-[#060a13] p-3 relative overflow-hidden">
              <svg
                viewBox="0 0 340 310"
                data-testid="atomic-svg-stage"
                data-model={modelKind}
                data-transitioning={animState.isTransitioning ? 'true' : 'false'}
                className="w-full max-h-[320px] mx-auto block"
                role="img"
                aria-label={`${MODEL_META[modelKind].label} SVG model for ${analysis.element.name} with ${analysis.protons} protons, ${analysis.neutrons} neutrons, and ${analysis.electrons} electrons`}
              >
                <defs>
                  <radialGradient id="plumPositiveGrad" cx="42%" cy="38%" r="60%">
                    <stop offset="0%" stopColor="#fb7185" stopOpacity="0.52" />
                    <stop offset="65%" stopColor="#e11d48" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#881337" stopOpacity="0.12" />
                  </radialGradient>
                  <radialGradient id="nucleusGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Top-Left Nuclide Badge inside SVG */}
                <g transform="translate(14, 16)">
                  <rect width="84" height="48" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />
                  <text x="12" y="20" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="700">
                    {analysis.massNumber}
                  </text>
                  <text x="12" y="38" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="700">
                    {analysis.protons}
                  </text>
                  <text x="34" y="32" fill="#f8fafc" fontSize="20" fontFamily="sans-serif" fontWeight="800">
                    {analysis.ionFormula}
                  </text>
                </g>

                {/* Model Badge Top-Right */}
                <text
                  x="326"
                  y="28"
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {MODEL_META[modelKind].scientist.toUpperCase()}
                </text>

                {/* Layer 1: Plum Pudding Diffuse Positive Sphere ("Pudding") */}
                {frame.puddingOpacity > 0.01 && (
                  <g opacity={frame.puddingOpacity}>
                    <circle
                      cx={ATOM_CENTER_X}
                      cy={ATOM_CENTER_Y}
                      r={frame.puddingRadius}
                      fill="url(#plumPositiveGrad)"
                      stroke="#fb7185"
                      strokeWidth="2"
                    />
                    {frame.plumSigns.map((sign, i) => (
                      <text
                        key={i}
                        x={sign.x}
                        y={sign.y}
                        textAnchor="middle"
                        fill="#fda4af"
                        fontSize="14"
                        fontWeight="700"
                        opacity={sign.opacity}
                      >
                        +
                      </text>
                    ))}
                  </g>
                )}

                {/* Layer 2: Rutherford Nuclear Boundary, Elliptical Paths & Alpha Overlay */}
                {(frame.rutherfordBoundaryOpacity > 0.01 || frame.rutherfordOrbitOpacity > 0.01) && (
                  <g>
                    <circle
                      cx={ATOM_CENTER_X}
                      cy={ATOM_CENTER_Y}
                      r="116"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="1.2"
                      strokeDasharray="4 4"
                      opacity={frame.rutherfordBoundaryOpacity}
                    />

                    <g
                      opacity={frame.rutherfordOrbitOpacity}
                      transform={`translate(${ATOM_CENTER_X} ${ATOM_CENTER_Y}) scale(${frame.rutherfordOrbitScale}) translate(${-ATOM_CENTER_X} ${-ATOM_CENTER_Y})`}
                    >
                      {[0, 48, 96, 144].map((deg, idx) => (
                        <ellipse
                          key={deg}
                          cx={ATOM_CENTER_X}
                          cy={ATOM_CENTER_Y}
                          rx={82 + (idx % 2) * 20}
                          ry={32 + idx * 5}
                          transform={`rotate(${deg} ${ATOM_CENTER_X} ${ATOM_CENTER_Y})`}
                          fill="none"
                          stroke="rgba(56, 189, 248, 0.28)"
                          strokeWidth="1.2"
                        />
                      ))}
                    </g>

                    {showAlphaOverlay && frame.alphaOverlayOpacity > 0.02 && (
                      <g opacity={frame.alphaOverlayOpacity}>
                        <line x1="16" y1="68" x2="324" y2="68" stroke="#34d399" strokeWidth="1.6" />
                        <line x1="16" y1="242" x2="324" y2="242" stroke="#34d399" strokeWidth="1.6" />
                        <path
                          d="M 16 124 Q 165 124 316 84"
                          fill="none"
                          stroke="#fbbf24"
                          strokeWidth="1.8"
                        />
                        <path
                          d="M 16 186 Q 165 186 316 226"
                          fill="none"
                          stroke="#fbbf24"
                          strokeWidth="1.8"
                        />
                        <path
                          d="M 16 155 L 138 155 L 34 114"
                          fill="none"
                          stroke="#f43f5e"
                          strokeWidth="2.2"
                        />
                        <text x="20" y="106" fill="#fda4af" fontSize="9" fontFamily="monospace">
                          Backscatter &gt;90° (1 in 8000)
                        </text>
                      </g>
                    )}
                  </g>
                )}

                {/* Layer 3: Bohr Quantized Energy Shells (K, L, M, N) */}
                {frame.bohrShellOpacity > 0.01 && (
                  <g
                    opacity={frame.bohrShellOpacity}
                    transform={`translate(${ATOM_CENTER_X} ${ATOM_CENTER_Y}) scale(${frame.bohrShellScale}) translate(${-ATOM_CENTER_X} ${-ATOM_CENTER_Y})`}
                  >
                    {[0, 1, 2, 3].map((shellIdx) => {
                      const count = analysis.shells[shellIdx] ?? 0;
                      if (shellIdx >= analysis.shells.length && photonPulse === 'idle') return null;
                      const radius = 44 + shellIdx * 24;
                      const shellName = ['K (n=1)', 'L (n=2)', 'M (n=3)', 'N (n=4)'][shellIdx];
                      const ringColors = ['#22d3ee', '#34d399', '#a78bfa', '#fbbf24'];
                      return (
                        <g key={shellIdx}>
                          <circle
                            cx={ATOM_CENTER_X}
                            cy={ATOM_CENTER_Y}
                            r={radius}
                            fill="none"
                            stroke={ringColors[shellIdx]}
                            strokeWidth="1.5"
                            strokeOpacity={count > 0 ? 0.65 : 0.25}
                            strokeDasharray={count > 0 ? undefined : '4 3'}
                          />
                          <text
                            x={ATOM_CENTER_X}
                            y={ATOM_CENTER_Y - radius - 3}
                            textAnchor="middle"
                            fill={ringColors[shellIdx]}
                            fontSize="8.5"
                            fontFamily="monospace"
                          >
                            {shellName}: {count}e⁻
                          </text>
                        </g>
                      );
                    })}

                    {photonPulse === 'emitted' && modelKind === 'bohr' && (
                      <g>
                        <path
                          d="M 214 115 Q 230 100 245 110 T 278 96 T 308 82"
                          fill="none"
                          stroke="#fde047"
                          strokeWidth="2.5"
                        />
                        <text x="278" y="74" fill="#fde047" fontSize="10" fontFamily="monospace" fontWeight="700">
                          γ Photon (ΔE = hf)
                        </text>
                      </g>
                    )}
                  </g>
                )}

                {/* Layer 4: Nucleus Glow & Morphing Nucleon Cluster */}
                {frame.nucleusGlowOpacity > 0.01 && (
                  <circle
                    cx={ATOM_CENTER_X}
                    cy={ATOM_CENTER_Y}
                    r={frame.nucleusGlowRadius}
                    fill="url(#nucleusGlow)"
                    opacity={frame.nucleusGlowOpacity}
                  />
                )}
                <g opacity={frame.nucleusClusterOpacity}>
                  {frame.nucleons.map((nuc, idx) => (
                    <circle
                      key={idx}
                      cx={nuc.x}
                      cy={nuc.y}
                      r={nuc.r}
                      fill={nuc.kind === 'p' ? '#f59e0b' : '#94a3b8'}
                      stroke="#090d16"
                      strokeWidth="0.6"
                    />
                  ))}
                </g>

                {/* Layer 5: Morphing Electrons across Models */}
                <g>
                  {frame.electrons.map((el, idx) => (
                    <g key={idx}>
                      <circle
                        cx={el.x}
                        cy={el.y}
                        r={el.r}
                        fill={el.isExcited ? '#fde047' : '#22d3ee'}
                        stroke="#082f49"
                        strokeWidth="1"
                      />
                      {frame.electronMinusOpacity > 0.05 && (
                        <text
                          x={el.x}
                          y={el.y + 2.8}
                          textAnchor="middle"
                          fill="#082f49"
                          fontSize="7"
                          fontWeight="800"
                          opacity={frame.electronMinusOpacity}
                        >
                          −
                        </text>
                      )}
                    </g>
                  ))}
                </g>

                {/* Layer 6: Frame Evolution Footer Caption */}
                {animState.isTransitioning ? (
                  <g>
                    <rect x="34" y="274" width="272" height="5" rx="2.5" fill="#1e293b" />
                    <rect
                      x="34"
                      y="274"
                      width={Math.max(8, 272 * frame.easedT)}
                      height="5"
                      rx="2.5"
                      fill="#34d399"
                    />
                    <text x="170" y="297" textAnchor="middle" fill="#a7f3d0" fontSize="10.5" fontFamily="monospace">
                      Evolving: {MODEL_META[animState.from].label} ({MODEL_META[animState.from].year}) → {MODEL_META[animState.to].label} ({MODEL_META[animState.to].year})
                    </text>
                  </g>
                ) : (
                  <text
                    x="170"
                    y="296"
                    textAnchor="middle"
                    fill={
                      modelKind === 'plum-pudding'
                        ? '#fda4af'
                        : modelKind === 'rutherford'
                          ? '#fcd34d'
                          : '#7dd3fc'
                    }
                    fontSize="11"
                  >
                    {modelKind === 'plum-pudding'
                      ? `Diffuse (+) Sphere · No Dense Nucleus · ${analysis.electrons} Embedded e⁻`
                      : modelKind === 'rutherford'
                        ? `Dense Nucleus (${analysis.protons}p⁺, ${analysis.neutrons}n⁰) + Empty Space`
                        : `Shells: ${analysis.shellNotation} · Subshells: ${analysis.subshellConfig}`}
                  </text>
                )}
              </svg>
            </div>

            {/* Active Model Explanation Strip */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">
                {MODEL_META[modelKind].scientist} ({MODEL_META[modelKind].year}):{' '}
              </strong>
              {MODEL_META[modelKind].summary}
            </div>
          </div>

          {/* Right 5 Cols: Interactive Proton/Neutron/Electron Counter + Readout */}
          <div className="xl:col-span-5 min-w-0 space-y-4">
            {/* Element Identity & Charge Card */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                    {analysis.element.category} · Period {analysis.element.period}
                  </div>
                  <div className="font-display text-xl font-bold text-white flex items-baseline gap-2">
                    <span>{analysis.element.name}</span>
                    <span className="font-mono text-cyan-300 text-base">({analysis.ionFormula})</span>
                  </div>
                </div>
                <span
                  data-testid="atom-charge-badge"
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                    analysis.netCharge === 0
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : analysis.netCharge > 0
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                        : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                  }`}
                >
                  {analysis.ionKind} ({analysis.chargeFormatted})
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center font-mono tabular-nums text-xs">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Atomic Z</div>
                  <div className="text-emerald-300 font-bold text-sm">{analysis.protons}</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Mass A</div>
                  <div className="text-amber-300 font-bold text-sm">{analysis.massNumber}</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Net Charge</div>
                  <div className="text-cyan-300 font-bold text-sm">{analysis.chargeFormatted}</div>
                </div>
              </div>
            </div>

            {/* Proton / Neutron / Electron Counter Controls */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
              <div className="text-xs font-bold text-white">Proton / Neutron / Electron Counter</div>

              {[
                {
                  id: 'protons',
                  label: 'Protons (p⁺ · Z)',
                  value: protons,
                  min: 1,
                  max: 30,
                  color: 'text-amber-300',
                  set: setProtons,
                },
                {
                  id: 'neutrons',
                  label: 'Neutrons (n⁰ · N)',
                  value: neutrons,
                  min: 0,
                  max: 38,
                  color: 'text-slate-200',
                  set: setNeutrons,
                },
                {
                  id: 'electrons',
                  label: 'Electrons (e⁻)',
                  value: electrons,
                  min: 0,
                  max: 32,
                  color: 'text-cyan-300',
                  set: setElectrons,
                },
              ].map((ctrl) => (
                <div key={ctrl.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
                  <span className="text-slate-300 font-medium sm:w-28 shrink-0">{ctrl.label}</span>
                  <div className="flex items-center gap-1.5 flex-1 min-w-0 w-full">
                    <button
                      type="button"
                      aria-label={`Decrease ${ctrl.label}`}
                      onClick={() => ctrl.set(Math.max(ctrl.min, ctrl.value - 1))}
                      disabled={ctrl.value <= ctrl.min}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-35 shrink-0"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="range"
                      aria-label={ctrl.label}
                      min={ctrl.min}
                      max={ctrl.max}
                      value={ctrl.value}
                      onChange={(e) => ctrl.set(Number(e.target.value))}
                      className="flex-1 min-w-0 w-full accent-emerald-400"
                    />
                    <button
                      type="button"
                      aria-label={`Increase ${ctrl.label}`}
                      onClick={() => ctrl.set(Math.min(ctrl.max, ctrl.value + 1))}
                      disabled={ctrl.value >= ctrl.max}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-35 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <span
                      data-testid={`counter-${ctrl.id}`}
                      className={`w-7 text-right font-mono font-bold tabular-nums shrink-0 ${ctrl.color}`}
                    >
                      {ctrl.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Electron Configuration & Valence Quantum Numbers */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between gap-2">
                <span className="text-slate-400">Shells (K,L,M,N):</span>
                <span className="font-mono text-white font-semibold">{analysis.shellNotation}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-400">Subshells:</span>
                <span data-testid="atom-subshell-config" className="font-mono text-emerald-300 font-semibold text-right">
                  {analysis.subshellConfig}
                </span>
              </div>
              {analysis.valenceQuantum && (
                <div className="flex justify-between gap-2 pt-1 border-t border-slate-800/80">
                  <span className="text-slate-400">Last e⁻ Quantum (n, l, mₗ, mₛ):</span>
                  <span className="font-mono text-violet-300 font-semibold">
                    ({analysis.valenceQuantum.n}, {analysis.valenceQuantum.l}, {analysis.valenceQuantum.ml}, {analysis.valenceQuantum.ms})
                  </span>
                </div>
              )}
              {analysis.specialNote && (
                <div className="mt-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-200 leading-relaxed">
                  {analysis.specialNote}
                </div>
              )}
            </div>

            {/* WASSCE Nuclide Presets */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                WASSCE Nuclide &amp; Exception Presets
              </div>
              <div className="flex flex-wrap gap-1.5">
                {WASSCE_ATOM_PRESETS.map((preset) => {
                  const active =
                    protons === preset.protons &&
                    neutrons === preset.neutrons &&
                    electrons === preset.electrons;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset.protons, preset.neutrons, preset.electrons)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                        active
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Experiment & Concept Diagrams Gallery */
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {DIAGRAM_TABS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDiagram(d.id)}
                aria-pressed={selectedDiagram === d.id}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                  selectedDiagram === d.id
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#060a13] p-4">
            {selectedDiagram === 'thomson-crt' && (
              <div className="space-y-2">
                <svg viewBox="0 0 640 220" className="w-full max-h-[240px] mx-auto" aria-label="Thomson Cathode Ray Tube Diagram">
                  {/* Evacuated Glass Tube */}
                  <path d="M 30 75 L 360 75 L 490 30 L 605 30 L 605 190 L 490 190 L 360 145 L 30 145 Z" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
                  {/* Cathode & Anode Slits */}
                  <rect x="46" y="88" width="12" height="44" fill="#94a3b8" />
                  <text x="52" y="165" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontFamily="monospace">Cathode (−)</text>
                  <rect x="135" y="75" width="8" height="28" fill="#fbbf24" />
                  <rect x="135" y="117" width="8" height="28" fill="#fbbf24" />
                  <text x="139" y="165" textAnchor="middle" fill="#fcd34d" fontSize="10" fontFamily="monospace">Anode (+)</text>
                  {/* Electric Deflection Plates */}
                  <rect x="235" y="79" width="95" height="9" rx="2" fill="#f43f5e" />
                  <text x="282" y="68" textAnchor="middle" fill="#fda4af" fontSize="10" fontFamily="monospace">Plate (+)</text>
                  <rect x="235" y="132" width="95" height="9" rx="2" fill="#38bdf8" />
                  <text x="282" y="162" textAnchor="middle" fill="#7dd3fc" fontSize="10" fontFamily="monospace">Plate (−)</text>
                  {/* Straight balanced vs Upward Electric Deflection Beam */}
                  <line x1="58" y1="110" x2="600" y2="110" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />
                  <path d="M 58 110 L 235 110 Q 320 108 600 58" fill="none" stroke="#22d3ee" strokeWidth="3" />
                  <circle cx="600" cy="58" r="5" fill="#67e8f9" />
                  <text x="530" y="22" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontFamily="monospace">ZnS Screen</text>
                  <text x="415" y="72" fill="#67e8f9" fontSize="10" fontFamily="monospace">e⁻ beam bends to (+)</text>
                </svg>
                <p className="text-xs text-slate-300">
                  <MathText text="Cathode rays accelerate through anode slits, deflect toward the positive plate ($e/m = 1.76 \times 10^{11}\text{ C kg}^{-1}$), and produce identical deflection in any gas." />
                </p>
              </div>
            )}

            {selectedDiagram === 'rutherford-foil' && (
              <div className="space-y-2">
                <svg viewBox="0 0 640 220" className="w-full max-h-[240px] mx-auto" aria-label="Rutherford Gold Foil Experiment Diagram">
                  {/* Lead Box + Source */}
                  <rect x="30" y="82" width="64" height="56" rx="6" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                  <circle cx="56" cy="110" r="10" fill="#fbbf24" />
                  <text x="62" y="155" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontFamily="monospace">α-Source (Pb Box)</text>
                  {/* Collimator */}
                  <rect x="135" y="74" width="10" height="28" fill="#64748b" />
                  <rect x="135" y="118" width="10" height="28" fill="#64748b" />
                  {/* ZnS Circular Detector Screen */}
                  <path d="M 380 24 A 95 95 0 1 1 380 196" fill="none" stroke="#34d399" strokeWidth="4" />
                  <text x="530" y="34" fill="#6ee7b7" fontSize="10" fontFamily="monospace">Rotatable ZnS Screen</text>
                  {/* Thin Gold Foil */}
                  <line x1="360" y1="68" x2="360" y2="152" stroke="#fbbf24" strokeWidth="5" />
                  <text x="360" y="172" textAnchor="middle" fill="#fde047" fontSize="10" fontFamily="monospace">Gold Foil (~10⁻⁷ m)</text>
                  {/* Alpha Particle Paths */}
                  <line x1="66" y1="110" x2="455" y2="110" stroke="#22d3ee" strokeWidth="2.5" />
                  <path d="M 145 106 L 358 106 L 445 64" fill="none" stroke="#fbbf24" strokeWidth="2" />
                  <path d="M 145 114 L 358 114 L 245 48" fill="none" stroke="#f43f5e" strokeWidth="2.2" />
                  <text x="215" y="42" fill="#fda4af" fontSize="10" fontFamily="monospace">1 in 8000 rebounds &gt;90°</text>
                </svg>
                <p className="text-xs text-slate-300">
                  <MathText text="Most $\alpha$-particles hit straight behind the gold foil, proving empty space; rare $>90^\circ$ rebounds prove a compact, dense, positively charged nucleus." />
                </p>
              </div>
            )}

            {selectedDiagram === 'millikan-drop' && (
              <div className="space-y-2">
                <svg viewBox="0 0 640 220" className="w-full max-h-[240px] mx-auto" aria-label="Millikan Oil Drop Diagram">
                  <rect x="120" y="30" width="380" height="160" rx="12" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                  <rect x="160" y="54" width="300" height="10" fill="#f43f5e" />
                  <rect x="160" y="156" width="300" height="10" fill="#38bdf8" />
                  <text x="480" y="63" fill="#fda4af" fontSize="10" fontFamily="monospace">+ Plate</text>
                  <text x="480" y="165" fill="#7dd3fc" fontSize="10" fontFamily="monospace">− Plate</text>
                  {/* Suspended Oil Drop */}
                  <circle cx="310" cy="110" r="10" fill="#fbbf24" />
                  <line x1="310" y1="98" x2="310" y2="70" stroke="#34d399" strokeWidth="2.2" />
                  <text x="322" y="84" fill="#6ee7b7" fontSize="10" fontFamily="monospace">qE (Upward)</text>
                  <line x1="310" y1="122" x2="310" y2="150" stroke="#fb7185" strokeWidth="2.2" />
                  <text x="322" y="142" fill="#fda4af" fontSize="10" fontFamily="monospace">mg (Gravity)</text>
                </svg>
                <p className="text-xs text-slate-300">
                  <MathText text="Millikan balanced $qE = mg$ on ionized oil droplets to find quantized charge steps of $e = -1.602 \times 10^{-19}\text{ C}$, yielding electron mass $m_e = 9.11 \times 10^{-31}\text{ kg}$." />
                </p>
              </div>
            )}

            {selectedDiagram === 'mass-spec' && (
              <div className="space-y-2">
                <svg viewBox="0 0 640 220" className="w-full max-h-[240px] mx-auto" aria-label="Five-Stage Mass Spectrometer Diagram">
                  {[
                    { x: 24, title: '1. Vaporize', sub: 'Gas sample', col: '#94a3b8' },
                    { x: 144, title: '2. Ionize', sub: 'e⁻ beam → X⁺', col: '#fbbf24' },
                    { x: 264, title: '3. Accelerate', sub: 'HV E-plates', col: '#22d3ee' },
                    { x: 384, title: '4. Deflect', sub: 'B-field (m/z)', col: '#10b981' },
                    { x: 504, title: '5. Detect', sub: 'Spectrum', col: '#a78bfa' },
                  ].map((st, idx) => (
                    <g key={st.title}>
                      <rect x={st.x} y="64" width="106" height="84" rx="10" fill="#0f172a" stroke={st.col} strokeWidth="2" />
                      <text x={st.x + 53} y="98" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="700">
                        {st.title}
                      </text>
                      <text x={st.x + 53} y="122" textAnchor="middle" fill={st.col} fontSize="10" fontFamily="monospace">
                        {st.sub}
                      </text>
                      {idx < 4 && (
                        <line x1={st.x + 106} y1="106" x2={st.x + 120} y2="106" stroke="#cbd5e1" strokeWidth="2" />
                      )}
                    </g>
                  ))}
                </svg>
                <p className="text-xs text-slate-300">
                  <MathText text="Ions with smaller $m/z$ deflect more sharply in the magnetic sector, resolving isotopes (e.g., $^{35}\text{Cl}^+$ and $^{37}\text{Cl}^+$) to determine $A_r$." />
                </p>
              </div>
            )}

            {selectedDiagram === 'quantum-orbitals' && (
              <div className="space-y-2">
                <svg viewBox="0 0 640 220" className="w-full max-h-[240px] mx-auto" aria-label="s, p, and d Atomic Orbital Shapes">
                  {/* s-orbital */}
                  <circle cx="110" cy="105" r="46" fill="rgba(34, 211, 238, 0.2)" stroke="#22d3ee" strokeWidth="2" />
                  <text x="110" y="180" textAnchor="middle" fill="#67e8f9" fontSize="12" fontWeight="700">s-orbital (l=0)</text>
                  <text x="110" y="196" textAnchor="middle" fill="#94a3b8" fontSize="10">Spherical · 1 orient.</text>

                  {/* p-orbital (dumbbell) */}
                  <ellipse cx="315" cy="75" rx="22" ry="34" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="2" />
                  <ellipse cx="315" cy="141" rx="22" ry="34" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="2" />
                  <text x="315" y="195" textAnchor="middle" fill="#6ee7b7" fontSize="12" fontWeight="700">p-orbital (l=1)</text>

                  {/* d-orbital (cloverleaf) */}
                  {[45, 135, 225, 315].map((ang) => (
                    <ellipse
                      key={ang}
                      cx="520"
                      cy="74"
                      rx="15"
                      ry="30"
                      transform={`rotate(${ang} 520 108)`}
                      fill="rgba(167, 139, 250, 0.22)"
                      stroke="#a78bfa"
                      strokeWidth="1.8"
                    />
                  ))}
                  <text x="520" y="195" textAnchor="middle" fill="#ddd6fe" fontSize="12" fontWeight="700">d-orbital (l=2)</text>
                </svg>
                <p className="text-xs text-slate-300">
                  <MathText text="Azimuthal quantum number $l$ governs 3D electron probability density ($|\psi|^2$): $s$ ($l=0$, 1 orbital), $p$ ($l=1$, 3 orbitals), $d$ ($l=2$, 5 orbitals)." />
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive AI Teaching Micro-Lesson & Knowledge Check */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-violet-300" />
            <span>
              Want a guided AI walkthrough &amp; live quiz on <strong className="text-white">{analysis.element.name} ({analysis.ionFormula})</strong> under the <strong className="text-white">{MODEL_META[modelKind].label}</strong> model?
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void handleTeachWithAI()}
              disabled={aiTeachLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-500 hover:bg-violet-400 text-slate-950 text-xs font-bold transition-colors disabled:opacity-60"
            >
              {aiTeachLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <BookOpen className="w-3.5 h-3.5" />
              )}
              <span>{aiTeachLoading ? 'Generating Interactive Lesson...' : 'AI Teach This Atom & Quiz Me'}</span>
            </button>

            {onLaunchAITeacher && (
              <button
                type="button"
                onClick={() =>
                  onLaunchAITeacher({
                    subject: 'chemistry',
                    grade,
                    topicTitle: `${analysis.element.name} (${analysis.ionFormula}) — ${MODEL_META[modelKind].label} Model`,
                    topicSummary: `Protons Z=${analysis.protons}, Neutrons N=${analysis.neutrons}, Electrons e-=${analysis.electrons}, Subshell=${analysis.subshellConfig}. ${MODEL_META[modelKind].summary}`,
                    keyFormulas: ['$A = Z + N$', `$\\text{Net charge} = ${analysis.protons} - ${analysis.electrons}$`],
                    autoStart: true,
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-200 text-xs font-semibold transition-colors whitespace-nowrap"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Guided AI Teacher + Voice</span>
              </button>
            )}

            {onAskTutor && (
              <button
                type="button"
                onClick={() =>
                  onAskTutor(
                    `Teach me about ${analysis.element.name} (${analysis.ionFormula}) with ${analysis.protons} protons, ${analysis.neutrons} neutrons, and ${analysis.electrons} electrons (${analysis.subshellConfig}) comparing the ${MODEL_META[modelKind].label} model for ${grade} WASSCE.`
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-semibold transition-colors whitespace-nowrap"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Open Chat Tutor</span>
              </button>
            )}
          </div>
        </div>

        {aiTeachError && (
          <div role="alert" className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200">
            {aiTeachError}
          </div>
        )}

        {atomVoiceError && (
          <div role="alert" className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
            {atomVoiceError}
          </div>
        )}

        {aiLesson && (
          <div
            data-testid="ai-interactive-lesson-card"
            className="rounded-xl bg-slate-900/90 border border-violet-500/35 p-4 space-y-3 text-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-display font-bold text-sm text-violet-200">
                {aiLesson.conceptTitle}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={isLoadingAtomVoice}
                  onClick={() =>
                    void handleSpeakAtomLesson(
                      `${aiLesson.conceptTitle}. ${aiLesson.explanation} ${aiLesson.stepByStepDerivation} Examiner tip: ${aiLesson.wassceTip}`
                    )
                  }
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors whitespace-nowrap ${
                    isSpeakingAtom
                      ? 'bg-rose-500/20 border-rose-500/45 text-rose-200'
                      : 'bg-cyan-500/15 hover:bg-cyan-500/25 border-cyan-500/40 text-cyan-200'
                  }`}
                >
                  {isLoadingAtomVoice ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : isSpeakingAtom ? (
                    <VolumeX className="w-3 h-3" />
                  ) : (
                    <Volume2 className="w-3 h-3" />
                  )}
                  <span>
                    {isLoadingAtomVoice ? 'Preparing Voice...' : isSpeakingAtom ? 'Stop Voice' : 'Listen to Lesson'}
                  </span>
                </button>
                {aiLesson.keyEquation && (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono text-cyan-300">
                    <MathText text={aiLesson.keyEquation} />
                  </span>
                )}
              </div>
            </div>

            <p className="text-slate-200 leading-relaxed">
              <MathText text={aiLesson.explanation} />
            </p>

            {aiLesson.stepByStepDerivation && (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
                <strong className="text-emerald-300">Worked Step-by-Step: </strong>
                <MathText text={aiLesson.stepByStepDerivation} />
              </div>
            )}

            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-200">
              <strong>WASSCE Examiner Tip: </strong>
              <MathText text={aiLesson.wassceTip} />
            </div>

            {/* Live AI Knowledge Check */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="font-semibold text-white">
                Interactive AI Knowledge Check: <MathText text={aiLesson.interactiveQuiz.prompt} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {aiLesson.interactiveQuiz.options.map((opt, idx) => {
                  const answered = aiQuizChoice !== null;
                  const isCorrect = idx === aiLesson.interactiveQuiz.correctIndex;
                  const isSelected = aiQuizChoice === idx;
                  let cls = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600';
                  if (answered) {
                    if (isCorrect) cls = 'bg-emerald-500/15 border-emerald-400 text-emerald-200';
                    else if (isSelected) cls = 'bg-rose-500/15 border-rose-400 text-rose-200';
                    else cls = 'bg-slate-950/50 border-slate-800/50 text-slate-500';
                  }
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAiQuizChoice(idx)}
                      className={`text-left p-2.5 rounded-xl border transition-colors ${cls}`}
                    >
                      <span className="font-mono font-bold mr-1.5">{String.fromCharCode(65 + idx)}.</span>
                      <MathText text={opt} />
                    </button>
                  );
                })}
              </div>
              {aiQuizChoice !== null && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <MathText text={aiLesson.interactiveQuiz.explanation} />
                </div>
              )}
            </div>

            {/* Interactive Follow-Up Ask / Reasoning Check */}
            <form onSubmit={(e) => void handleSubmitAtomFollowUp(e)} className="pt-2 border-t border-slate-800 space-y-2">
              <label htmlFor="atom-ai-followup" className="text-[11px] font-semibold text-slate-300 block">
                Ask a follow-up question or test your explanation on {analysis.element.name}:
              </label>
              <div className="flex gap-2">
                <input
                  id="atom-ai-followup"
                  type="text"
                  value={followUpDraft}
                  onChange={(e) => setFollowUpDraft(e.target.value)}
                  placeholder="e.g. Why do 4s electrons fill before 3d, or why did Rutherford reject Plum Pudding?"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={!followUpDraft.trim() || followUpLoading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs whitespace-nowrap"
                >
                  {followUpLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Ask</span>
                </button>
              </div>
              {followUpFeedback && (
                <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-cyan-300">AI Teacher Reply</span>
                    <button
                      type="button"
                      onClick={() => void handleSpeakAtomLesson(followUpFeedback.spokenFeedback)}
                      className="inline-flex items-center gap-1 text-[11px] text-cyan-200 hover:text-white"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Hear Reply</span>
                    </button>
                  </div>
                  <MarkdownPreview content={followUpFeedback.feedback} />
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
