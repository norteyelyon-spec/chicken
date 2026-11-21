import React, { useEffect, useState } from 'react';
import { FlaskConical, Play, Sparkles, UserCheck } from 'lucide-react';
import type { SimulatorKind, SubjectId, TeacherPersonaId } from '../types';
import { SUBJECTS } from '../data/subjects';
import { TEACHER_PERSONA_PROFILES } from '../utils/personalization';

interface AIHumanTeacherPresenterProps {
  personaId: TeacherPersonaId;
  onChangePersona: (id: TeacherPersonaId) => void;
  subject: SubjectId;
  lessonTitle: string;
  isPlaying: boolean;
  isSpeaking: boolean;
  syncProgress: number;
  activeSpokenText: string;
  recommendedSimKind: SimulatorKind;
  activeSimOpen: boolean;
  onToggleSimulation: (simKind: SimulatorKind) => void;
}

const SIM_SHORT_LABELS: Record<SimulatorKind, string> = {
  'ohms-law': "Ohm's Law Circuit",
  'projectile-3d': '3D Projectile Lab',
  'pendulum-3d': '3D Pendulum Motion',
  'optics-3d': '3D Convex Lens Bench',
  'micrometer-3d': '3D Micrometer Gauge',
  titration: 'Acid-Base Titration',
  'gas-laws': 'Boyle & Charles Gas Lab',
  'wave-standing': 'Standing Wave Harmonics',
  'enzyme-rate': 'Enzyme Kinetics Lab',
  'logic-gate': 'Digital Logic Gates',
  'thomson-crt': 'Thomson CRT Beam',
  'rutherford-scattering': 'Rutherford Gold Foil',
  'math-function-calc': 'Calculus Curve Explorer',
  'radioactive-decay': 'Half-Life Decay Lab',
  'osmosis-cell': 'Osmosis & Photosynthesis',
  'simple-machines': 'Inclined Plane Machine',
  'kinematics-motion': 'Kinematics v-t Tracker',
  'thermal-calorimetry': 'Thermal Calorimetry',
  'bearings-trig': '3-Figure Bearings Trig',
  'electrostatics-field': 'Coulomb Field Vectors',
  'ac-transformer-3d': 'AC Transformer Coil',
  'genetics-punnett': 'Punnett Cross Genetics',
};

export const AIHumanTeacherPresenter: React.FC<AIHumanTeacherPresenterProps> = ({
  personaId,
  onChangePersona,
  subject,
  lessonTitle,
  isPlaying,
  isSpeaking,
  syncProgress,
  activeSpokenText,
  recommendedSimKind,
  activeSimOpen,
  onToggleSimulation,
}) => {
  const persona = TEACHER_PERSONA_PROFILES[personaId] ?? TEACHER_PERSONA_PROFILES.kofi;
  const sub = SUBJECTS[subject];
  const [animTick, setAnimTick] = useState(0);

  useEffect(() => {
    if (!isPlaying && !isSpeaking) return;
    const id = window.setInterval(() => {
      setAnimTick((t) => (t + 1) % 60);
    }, 150);
    return () => window.clearInterval(id);
  }, [isPlaying, isSpeaking]);

  const mouthOpen = isPlaying || isSpeaking ? 3.2 + (animTick % 3) * 2.1 : 1.4;
  const isBlinking = animTick === 17 || animTick === 48;
  const pointerTilt = isPlaying ? Math.sin(syncProgress * Math.PI * 6) * 8 : -6;
  const simLabel = SIM_SHORT_LABELS[recommendedSimKind] ?? 'Interactive Simulation';

  return (
    <div
      data-testid="ai-human-teacher-presenter"
      className="rounded-xl border border-slate-700/90 bg-[#0b1324] px-3.5 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 shadow-lg"
    >
      {/* Left: Animated Human AI Teacher Standing In Front of Classroom Stage */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className="relative w-20 h-20 rounded-xl border border-slate-700 bg-[#060d1c] shrink-0 overflow-hidden flex items-end justify-center"
          aria-hidden="true"
        >
          <svg viewBox="0 0 96 96" className="w-20 h-20">
            {/* Classroom board glow behind teacher */}
            <rect x="4" y="4" width="88" height="88" rx="10" fill="#071326" />
            <rect
              x="8"
              y="8"
              width="80"
              height="48"
              rx="4"
              fill="#0c1f38"
              stroke={persona.accentHex}
              strokeOpacity="0.35"
              strokeWidth="1.2"
            />
            <line x1="14" y1="20" x2="40" y2="20" stroke={persona.accentHex} strokeOpacity="0.4" strokeWidth="1.5" />
            <line x1="14" y1="28" x2="34" y2="28" stroke="#94a3b8" strokeOpacity="0.35" strokeWidth="1.5" />

            {/* Teacher Torso & Suit/Lab Coat */}
            <path
              d="M 20 96 C 20 71 32 64 48 64 C 64 64 76 71 76 96 Z"
              fill={persona.shirtHex}
            />
            <path d="M 41 64 L 48 80 L 55 64 Z" fill="#f8fafc" />
            <path d="M 46.5 67 L 48 86 L 49.5 67 Z" fill={persona.tieHex} />

            {/* Neck & Head */}
            <rect x="43" y="54" width="10" height="12" rx="4" fill={persona.skinHex} />
            <ellipse cx="48" cy="40" rx="14" ry="16" fill={persona.skinHex} />

            {/* Hair */}
            <path
              d={
                personaId === 'kofi'
                  ? 'M 34 36 C 34 22 62 22 62 36 C 58 28 38 28 34 36 Z'
                  : 'M 32 42 C 31 20 65 20 64 42 C 60 28 36 28 32 42 Z'
              }
              fill={persona.hairHex}
            />

            {/* Eyes (with blinking) */}
            {isBlinking ? (
              <>
                <line x1="40" y1="39" x2="45" y2="39" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="51" y1="39" x2="56" y2="39" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="42.5" cy="39" r="2.1" fill="#0f172a" />
                <circle cx="53.5" cy="39" r="2.1" fill="#0f172a" />
                <circle cx="43.1" cy="38.3" r="0.7" fill="#ffffff" />
                <circle cx="54.1" cy="38.3" r="0.7" fill="#ffffff" />
              </>
            )}

            {/* Glasses for Dr. Abena / Ms. Efua */}
            {personaId !== 'kofi' && (
              <g stroke="#e2e8f0" strokeWidth="1.1" fill="none">
                <rect x="38.5" y="35.5" width="7.5" height="6" rx="2" />
                <rect x="50" y="35.5" width="7.5" height="6" rx="2" />
                <line x1="46" y1="38.5" x2="50" y2="38.5" />
              </g>
            )}

            {/* Animated Speaking Mouth */}
            <ellipse
              cx="48"
              cy="47.5"
              rx="4.2"
              ry={mouthOpen * 0.55}
              fill="#3f1d1d"
              stroke="#fda4af"
              strokeWidth="0.8"
            />

            {/* Gesturing Arm & Board Pointer Baton */}
            <g transform={`translate(66, 72) rotate(${pointerTilt})`}>
              <line x1="0" y1="6" x2="14" y2="-16" stroke={persona.skinHex} strokeWidth="4.2" strokeLinecap="round" />
              <line x1="12" y1="-14" x2="22" y2="-32" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="22.5" cy="-32.5" r="2" fill={persona.accentHex} />
            </g>
          </svg>

          {(isPlaying || isSpeaking) && (
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400"
              title="Teacher actively presenting"
            />
          )}
        </div>

        <div className="min-w-0 space-y-1 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-white">
              <UserCheck className="w-3.5 h-3.5" style={{ color: persona.accentHex }} />
              <span>{persona.name}</span>
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              {persona.roleTitle} · {sub.shortName}
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-snug line-clamp-2">
            {isPlaying
              ? activeSpokenText || `Explaining "${lessonTitle}" step by step with visual models.`
              : `${persona.greetingStyle}. Ready to teach "${lessonTitle}" and spin up live simulations.`}
          </p>

          {/* Teacher Persona Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {(['kofi', 'abena', 'efua'] as TeacherPersonaId[]).map((id) => {
              const item = TEACHER_PERSONA_PROFILES[id];
              const active = id === personaId;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChangePersona(id)}
                  data-testid={`human-teacher-persona-${id}`}
                  aria-pressed={active}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition-colors ${
                    active
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Teacher Simulation Generator Action */}
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onToggleSimulation(recommendedSimKind)}
          data-testid="teacher-create-sim-btn"
          aria-expanded={activeSimOpen}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
            activeSimOpen
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 hover:bg-emerald-400'
              : 'bg-cyan-500/15 hover:bg-cyan-500/25 border-cyan-400/50 text-cyan-200'
          }`}
        >
          {activeSimOpen ? <Sparkles className="w-3.5 h-3.5" /> : <FlaskConical className="w-3.5 h-3.5" />}
          <span>{activeSimOpen ? 'Hide Teacher Simulation' : `Create Simulation: ${simLabel}`}</span>
          {!activeSimOpen && <Play className="w-3 h-3 fill-current" />}
        </button>
      </div>
    </div>
  );
};
