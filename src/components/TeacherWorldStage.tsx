import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  FlaskConical,
  Pause,
  Play,
  Sparkles,
  UserCheck,
  Volume2,
} from 'lucide-react';
import { SUBJECTS } from '../data/subjects';
import type {
  GradeLevel,
  SimulatorKind,
  SubjectId,
  TeacherPersonaId,
} from '../types';
import type { VideoLessonScene } from '../utils/noteVideo';
import { TEACHER_PERSONA_PROFILES } from '../utils/personalization';

interface TeacherWorldStageProps {
  scene: VideoLessonScene;
  sceneIdx: number;
  totalScenes: number;
  noteTitle: string;
  subject: SubjectId;
  grade: GradeLevel;
  personaId: TeacherPersonaId;
  onChangePersona: (id: TeacherPersonaId) => void;
  isPlaying: boolean;
  isSpeaking: boolean;
  syncProgress: number;
  activeSpokenText: string;
  showClickToPlayGate: boolean;
  onTogglePlay: () => void;
  recommendedSimKind: SimulatorKind;
  activeSimOpen: boolean;
  onToggleSimulation: (simKind: SimulatorKind) => void;
}

type IllustrationKind =
  | 'recurring'
  | 'base-mod'
  | 'venn'
  | 'coordinate'
  | 'trig-bearing'
  | 'sector-cone'
  | 'ogive-histogram'
  | 'prob-tree'
  | 'atom'
  | 'optics'
  | 'circuit'
  | 'chemistry'
  | 'biology'
  | 'logic'
  | 'general';

function pickIllustrationKind(scene: VideoLessonScene, noteTitle: string): IllustrationKind {
  const combined = `${noteTitle} ${scene.title} ${scene.keyPoints.join(' ')}`.toLowerCase();
  if (/recurring|0\.2|990x|rational/.test(combined)) return 'recurring';
  if (/venn|intersection|union|complement|inclusive/.test(combined)) return 'venn';
  if (/modular|mod\s*\d|number base|base\s*x|23_x/.test(combined)) return 'base-mod';
  if (/bisector|gradient|perpendicular|coordinate|midpoint/.test(combined)) return 'coordinate';
  if (/bearing|special angle|trigonometr|30\^|45\^|60\^|sin|cos|tan/.test(combined)) return 'trig-bearing';
  if (/sector|cone|slant height|mensuration|frustum/.test(combined)) return 'sector-cone';
  if (/ogive|cumulative|quartile|frequency density|histogram|variance|deviation/.test(combined)) return 'ogive-histogram';
  if (/probability tree|without replacement|independent event|conditional/.test(combined)) return 'prob-tree';
  if (/atom|bohr|rutherford|orbital|quantum|isotope|radioactiv/.test(combined)) return 'atom';
  if (/optic|lens|mirror|refract|snell|wave|microscope|diffraction/.test(combined)) return 'optics';
  if (/circuit|ohm|resistor|capacitor|transformer|induct|faraday/.test(combined)) return 'circuit';
  if (/logic gate|boolean|de morgan|nand|xor|sql|database|network|osi/.test(combined)) return 'logic';
  if (/titration|mole|stoichiom|gas law|enthalpy|acid|alkane|ester|saponification/.test(combined)) return 'chemistry';
  if (/osmosis|plasmolysis|cell|enzyme|photosynth|respirat|heart|nephron|genetics/.test(combined)) return 'biology';
  return 'general';
}

const WorldVisualEasel: React.FC<{
  kind: IllustrationKind;
  scene: VideoLessonScene;
  syncProgress: number;
  accentHex: string;
}> = ({ kind, scene, syncProgress, accentHex }) => {
  const pulsePhase = Math.sin(syncProgress * Math.PI * 4);
  const stepPhase = Math.min(1, Math.max(0, syncProgress));

  return (
    <svg
      viewBox="0 0 420 250"
      className="w-full h-full"
      role="img"
      aria-label={`Visual teaching illustration for ${scene.title}`}
      data-testid="teacher-world-illustration"
      data-illustration-kind={kind}
    >
      <defs>
        <pattern id="tw-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="420" height="250" rx="12" fill="#070e1d" />
      <rect x="0" y="0" width="420" height="250" rx="12" fill="url(#tw-grid)" />

      {kind === 'recurring' && (
        <g>
          <text x="24" y="34" fill={accentHex} fontSize="12" fontWeight="700" fontFamily="monospace">
            TAIL CANCELLATION VISUALIZER
          </text>
          <rect x="24" y="48" width="372" height="44" rx="8" fill="#0f1b33" stroke="#334155" />
          <text x="38" y="75" fill="#e2e8f0" fontSize="15" fontFamily="monospace" fontWeight="700">
            1000x = 236.
          </text>
          <text
            x="164"
            y="75"
            fill="#22d3ee"
            fontSize="15"
            fontFamily="monospace"
            fontWeight="700"
            opacity={stepPhase > 0.35 ? 1 : 0.6}
          >
            363636...
          </text>

          <rect x="24" y="102" width="372" height="44" rx="8" fill="#0f1b33" stroke="#334155" />
          <text x="38" y="129" fill="#cbd5e1" fontSize="15" fontFamily="monospace" fontWeight="700">
            −  10x =   2.
          </text>
          <text x="164" y="129" fill="#22d3ee" fontSize="15" fontFamily="monospace" fontWeight="700">
            363636...
          </text>

          {/* Animated strike lines across matching infinite tails */}
          <line
            x1="160"
            y1="70"
            x2={160 + 96 * Math.min(1, stepPhase * 1.4)}
            y2="70"
            stroke="#fbbf24"
            strokeWidth="2.5"
          />
          <line
            x1="160"
            y1="124"
            x2={160 + 96 * Math.min(1, stepPhase * 1.4)}
            y2="124"
            stroke="#fbbf24"
            strokeWidth="2.5"
          />
          <text x="275" y="102" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="700">
            Tails Cancel = 0!
          </text>

          <rect x="24" y="160" width="372" height="64" rx="10" fill="rgba(16, 185, 129, 0.12)" stroke="#10b981" />
          <text x="38" y="187" fill="#6ee7b7" fontSize="14" fontFamily="monospace" fontWeight="700">
            990x = 234   ⇒   x = 234/990 = 13/55
          </text>
          <text x="38" y="210" fill="#cbd5e1" fontSize="11">
            Multiply by 10^k so identical repeating digits line up vertically.
          </text>
        </g>
      )}

      {kind === 'venn' && (
        <g>
          <text x="24" y="30" fill={accentHex} fontSize="12" fontWeight="700" fontFamily="monospace">
            3-SET VENN: FILL CENTER OUTWARD
          </text>
          <rect x="22" y="42" width="376" height="190" rx="10" fill="#0b152a" stroke="#1e293b" />
          <circle cx="170" cy="112" r="54" fill="rgba(56,189,248,0.14)" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="246" cy="112" r="54" fill="rgba(16,185,129,0.14)" stroke="#10b981" strokeWidth="2" />
          <circle cx="208" cy="168" r="54" fill="rgba(251,191,36,0.14)" stroke="#fbbf24" strokeWidth="2" />

          <text x="126" y="96" fill="#7dd3fc" fontSize="11" fontWeight="700">Set A</text>
          <text x="268" y="96" fill="#6ee7b7" fontSize="11" fontWeight="700">Set B</text>
          <text x="196" y="212" fill="#fcd34d" fontSize="11" fontWeight="700">Set C</text>

          {/* Center intersection highlight */}
          <circle
            cx="208"
            cy="132"
            r={14 + pulsePhase * 2}
            fill="rgba(244, 63, 94, 0.35)"
            stroke="#fb7185"
            strokeWidth="2"
          />
          <text x="193" y="136" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="700">
            A∩B∩C
          </text>
          <text x="292" y="176" fill="#94a3b8" fontSize="10" fontFamily="monospace">
            Step 1: Center x
          </text>
          <text x="292" y="192" fill="#94a3b8" fontSize="10" fontFamily="monospace">
            Step 2: Subtract x
          </text>
          <text x="292" y="208" fill="#94a3b8" fontSize="10" fontFamily="monospace">
            Step 3: Outer Wings
          </text>
        </g>
      )}

      {kind === 'base-mod' && (
        <g>
          <text x="24" y="30" fill={accentHex} fontSize="12" fontWeight="700" fontFamily="monospace">
            POSITIONAL POWERS & MODULAR WHEEL
          </text>
          {/* Base-x blocks */}
          <rect x="24" y="48" width="178" height="176" rx="10" fill="#0f1b33" stroke="#334155" />
          <text x="36" y="70" fill="#38bdf8" fontSize="11" fontWeight="700" fontFamily="monospace">
            BASE-x PLACE VALUES
          </text>
          {[
            { col: 'x¹', digit: '2', val: '2x' },
            { col: 'x⁰', digit: '3', val: '3·1' },
          ].map((c, idx) => (
            <g key={c.col} transform={`translate(${40 + idx * 78}, 86)`}>
              <rect width="64" height="72" rx="8" fill="#172542" stroke="#38bdf8" strokeOpacity="0.55" />
              <text x="24" y="22" fill="#94a3b8" fontSize="11" fontFamily="monospace">{c.col}</text>
              <text x="24" y="48" fill="#ffffff" fontSize="20" fontWeight="700" fontFamily="monospace">{c.digit}</text>
              <text x="18" y="64" fill="#22d3ee" fontSize="10" fontFamily="monospace">{c.val}</text>
            </g>
          ))}
          <text x="36" y="186" fill="#fcd34d" fontSize="11" fontFamily="monospace" fontWeight="700">
            Valid iff base x &gt; max digit
          </text>
          <text x="36" y="206" fill="#cbd5e1" fontSize="11" fontFamily="monospace">
            e.g. digit 4 ⇒ x ≥ 5
          </text>

          {/* Modulo 5 Clock Wheel */}
          <rect x="218" y="48" width="178" height="176" rx="10" fill="#0f1b33" stroke="#334155" />
          <text x="240" y="70" fill="#10b981" fontSize="11" fontWeight="700" fontFamily="monospace">
            MOD 5 REMAINDER RING
          </text>
          <circle cx="307" cy="144" r="52" fill="none" stroke="#334155" strokeWidth="2" />
          {[0, 1, 2, 3, 4].map((r) => {
            const ang = (r / 5) * Math.PI * 2 - Math.PI / 2;
            const cx = 307 + Math.cos(ang) * 52;
            const cy = 144 + Math.sin(ang) * 52;
            const active = Math.floor(stepPhase * 5) % 5 === r;
            return (
              <g key={r}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={active ? 13 : 11}
                  fill={active ? '#10b981' : '#1e293b'}
                  stroke="#34d399"
                />
                <text
                  x={cx - 3.5}
                  y={cy + 4}
                  fill={active ? '#020617' : '#e2e8f0'}
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="monospace"
                >
                  {r}
                </text>
              </g>
            );
          })}
          <text x="275" y="148" fill="#cbd5e1" fontSize="11" fontFamily="monospace">
            ≡ r (mod 5)
          </text>
        </g>
      )}

      {kind === 'coordinate' && (
        <g>
          <text x="24" y="28" fill={accentHex} fontSize="12" fontWeight="700" fontFamily="monospace">
            PERPENDICULAR BISECTOR GEOMETRY (m₁ · m₂ = −1)
          </text>
          <line x1="48" y1="215" x2="380" y2="215" stroke="#475569" strokeWidth="1.5" />
          <line x1="70" y1="42" x2="70" y2="232" stroke="#475569" strokeWidth="1.5" />

          {/* Segment AB */}
          <line x1="118" y1="168" x2="290" y2="82" stroke="#38bdf8" strokeWidth="3" />
          {/* Perpendicular bisector through M */}
          <line x1="158" y1="42" x2="250" y2="226" stroke="#10b981" strokeWidth="2.5" strokeDasharray="6 4" />
          {/* Right angle square at M(204, 125) */}
          <path d="M 196 129 L 200 137 L 208 133" fill="none" stroke="#fbbf24" strokeWidth="1.8" />

          <circle cx="118" cy="168" r="5" fill="#38bdf8" />
          <text x="86" y="186" fill="#e2e8f0" fontSize="11" fontFamily="monospace">A(2, 3)</text>

          <circle cx="290" cy="82" r="5" fill="#38bdf8" />
          <text x="296" y="84" fill="#e2e8f0" fontSize="11" fontFamily="monospace">B(6, 5)</text>

          <circle cx="204" cy="125" r="6" fill="#fbbf24" />
          <text x="214" y="122" fill="#fcd34d" fontSize="11" fontWeight="700" fontFamily="monospace">M(4, 4)</text>

          <rect x="260" y="156" width="144" height="52" rx="8" fill="#0f1b33" stroke="#10b981" strokeOpacity="0.6" />
          <text x="270" y="177" fill="#6ee7b7" fontSize="11" fontFamily="monospace">m₁ = +1/2 ⇒ m₂ = −2</text>
          <text x="270" y="196" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily="monospace">2x + y = 12</text>
        </g>
      )}

      {kind === 'trig-bearing' && (
        <g>
          <text x="24" y="28" fill={accentHex} fontSize="12" fontWeight="700" fontFamily="monospace">
            CLOCKWISE NORTH BEARING & EXACT TRIG RATIOS
          </text>
          {/* Compass from Point A */}
          <line x1="125" y1="52" x2="125" y2="215" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="120" y="46" fill="#fbbf24" fontSize="12" fontWeight="700">N (000°)</text>
          <circle cx="125" cy="145" r="44" fill="none" stroke="#334155" strokeWidth="1.5" />

          {/* Bearing arc clockwise */}
          <path
            d="M 125 101 A 44 44 0 0 1 164 166"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="3.5"
          />
          <line x1="125" y1="145" x2="225" y2="196" stroke="#10b981" strokeWidth="3" />
          <circle cx="125" cy="145" r="5" fill="#fbbf24" />
          <text x="86" y="148" fill="#ffffff" fontSize="11" fontWeight="700">FROM A</text>
          <circle cx="225" cy="196" r="5" fill="#10b981" />
          <text x="232" y="200" fill="#6ee7b7" fontSize="11" fontWeight="700">TO B (120°)</text>

          {/* 30-60-90 Reference Triangle */}
          <g transform="translate(260, 56)">
            <polygon points="10,108 120,108 10,18" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" strokeWidth="2" />
            <text x="-4" y="68" fill="#cbd5e1" fontSize="11" fontFamily="monospace">√3</text>
            <text x="58" y="124" fill="#cbd5e1" fontSize="11" fontFamily="monospace">1</text>
            <text x="72" y="56" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="700">2</text>
            <text x="20" y="98" fill="#7dd3fc" fontSize="10" fontFamily="monospace">60°</text>
            <text x="18" y="42" fill="#7dd3fc" fontSize="10" fontFamily="monospace">30°</text>
          </g>
        </g>
      )}

      {kind === 'sector-cone' && (
        <g>
          <text x="24" y="28" fill={accentHex} fontSize="12" fontWeight="700" fontFamily="monospace">
            SECTOR FOLDING INTO 3D CONE (l = R, 2πr = Arc)
          </text>
          {/* Left: Flat Sector */}
          <path d="M 105 145 L 42 75 A 95 95 0 0 1 168 75 Z" fill="rgba(56,189,248,0.18)" stroke="#38bdf8" strokeWidth="2.5" />
          <text x="98" y="120" fill="#fbbf24" fontSize="11" fontFamily="monospace">θ</text>
          <text x="52" y="118" fill="#e2e8f0" fontSize="11" fontFamily="monospace">R</text>
          <text x="72" y="62" fill="#6ee7b7" fontSize="10" fontFamily="monospace">Arc L = (θ/360)·2πR</text>

          {/* Transformation Arrow */}
          <path d="M 186 125 L 236 125" stroke="#fbbf24" strokeWidth="2.5" />
          <polygon points="234,119 246,125 234,131" fill="#fbbf24" />

          {/* Right: 3D Cone */}
          <ellipse cx="322" cy="182" rx="54" ry="18" fill="rgba(16,185,129,0.16)" stroke="#10b981" strokeWidth="2" />
          <line x1="322" y1="58" x2="268" y2="182" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="322" y1="58" x2="376" y2="182" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="322" y1="58" x2="322" y2="182" stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="4 4" />
          <line x1="322" y1="182" x2="376" y2="182" stroke="#f43f5e" strokeWidth="2" />
          <text x="328" y="128" fill="#fbbf24" fontSize="11" fontFamily="monospace">h</text>
          <text x="344" y="176" fill="#fda4af" fontSize="11" fontFamily="monospace">r</text>
          <text x="358" y="114" fill="#7dd3fc" fontSize="11" fontFamily="monospace" fontWeight="700">l = R</text>
        </g>
      )}

      {kind === 'ogive-histogram' && (
        <g>
          <text x="24" y="28" fill={accentHex} fontSize="12" fontWeight="700" fontFamily="monospace">
            OGIVE QUARTILES (UCB) & FREQUENCY DENSITY
          </text>
          <line x1="48" y1="205" x2="386" y2="205" stroke="#475569" strokeWidth="1.5" />
          <line x1="48" y1="45" x2="48" y2="205" stroke="#475569" strokeWidth="1.5" />

          {/* Unequal Width Histogram Background Bars */}
          <rect x="64" y="155" width="38" height="50" fill="rgba(56,189,248,0.18)" stroke="#38bdf8" strokeOpacity="0.5" />
          <rect x="102" y="120" width="76" height="85" fill="rgba(16,185,129,0.18)" stroke="#10b981" strokeOpacity="0.5" />
          <rect x="178" y="152" width="114" height="53" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" strokeOpacity="0.5" />

          {/* Ogive S-curve anchored at (56, 205) */}
          <path
            d="M 56 205 C 120 198, 175 110, 250 72 C 295 52, 345 48, 372 48"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="3"
          />
          {/* Q2 Median trace line */}
          <line x1="48" y1="126" x2="182" y2="126" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="5 4" />
          <line x1="182" y1="126" x2="182" y2="205" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="5 4" />
          <circle cx="182" cy="126" r="4.5" fill="#f43f5e" />
          <text x="12" y="130" fill="#fda4af" fontSize="10" fontFamily="monospace">50% N</text>
          <text x="172" y="222" fill="#fda4af" fontSize="10" fontFamily="monospace">Q₂ Median</text>
          <text x="275" y="222" fill="#94a3b8" fontSize="10" fontFamily="monospace">Upper Class Boundaries →</text>
        </g>
      )}

      {kind === 'prob-tree' && (
        <g>
          <text x="24" y="28" fill={accentHex} fontSize="12" fontWeight="700" fontFamily="monospace">
            WITHOUT REPLACEMENT PROBABILITY TREE
          </text>
          <circle cx="48" cy="135" r="8" fill="#fbbf24" />
          {/* 1st Draw */}
          <line x1="56" y1="135" x2="165" y2="80" stroke="#f43f5e" strokeWidth="2.5" />
          <line x1="56" y1="135" x2="165" y2="190" stroke="#38bdf8" strokeWidth="2.5" />
          <text x="86" y="96" fill="#fda4af" fontSize="11" fontFamily="monospace">R (5/8)</text>
          <text x="86" y="182" fill="#7dd3fc" fontSize="11" fontFamily="monospace">B (3/8)</text>

          {/* 2nd Draw (denominator drops to 7) */}
          <circle cx="165" cy="80" r="6" fill="#f43f5e" />
          <line x1="171" y1="80" x2="292" y2="56" stroke="#f43f5e" strokeWidth="2" />
          <line x1="171" y1="80" x2="292" y2="104" stroke="#38bdf8" strokeWidth="2" />
          <text x="208" y="60" fill="#fda4af" fontSize="11" fontFamily="monospace">R (4/7)</text>
          <text x="208" y="106" fill="#7dd3fc" fontSize="11" fontFamily="monospace">B (3/7)</text>

          <circle cx="165" cy="190" r="6" fill="#38bdf8" />
          <line x1="171" y1="190" x2="292" y2="164" stroke="#f43f5e" strokeWidth="2" />
          <line x1="171" y1="190" x2="292" y2="212" stroke="#38bdf8" strokeWidth="2" />
          <text x="208" y="168" fill="#fda4af" fontSize="11" fontFamily="monospace">R (5/7)</text>
          <text x="208" y="214" fill="#7dd3fc" fontSize="11" fontFamily="monospace">B (2/7)</text>

          <text x="304" y="60" fill="#6ee7b7" fontSize="11" fontFamily="monospace">20/56</text>
          <text x="304" y="108" fill="#6ee7b7" fontSize="11" fontFamily="monospace">15/56</text>
          <text x="304" y="168" fill="#6ee7b7" fontSize="11" fontFamily="monospace">15/56</text>
          <text x="304" y="216" fill="#6ee7b7" fontSize="11" fontFamily="monospace">6/56</text>
        </g>
      )}

      {kind === 'atom' && (
        <g>
          <text x="24" y="28" fill={accentHex} fontSize="12" fontWeight="700" fontFamily="monospace">
            QUANTUM SHELLS & PHOTON EMISSION (ΔE = hf)
          </text>
          <circle cx="210" cy="135" r="14" fill="#ef4444" />
          <text x="200" y="139" fill="#ffffff" fontSize="10" fontWeight="700">+Ze</text>
          {[42, 72, 98].map((r, i) => (
            <circle key={r} cx="210" cy="135" r={r} fill="none" stroke={i === 1 ? '#38bdf8' : '#334155'} strokeWidth="1.8" strokeDasharray={i === 2 ? '5 4' : undefined} />
          ))}
          {[0, 1, 2].map((idx) => {
            const ang = syncProgress * Math.PI * 4 + idx * 2.1;
            const r = idx === 0 ? 42 : 72;
            return (
              <circle
                key={idx}
                cx={210 + Math.cos(ang) * r}
                cy={135 + Math.sin(ang) * r}
                r="5.5"
                fill="#22d3ee"
              />
            );
          })}
          <path d="M 282 135 Q 296 122 310 135 T 338 135 T 366 135" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
          <text x="302" y="116" fill="#fcd34d" fontSize="11" fontFamily="monospace">Photon hf</text>
        </g>
      )}

      {kind === 'optics' && (
        <g>
          <text x="24" y="28" fill={accentHex} fontSize="12" fontWeight="700" fontFamily="monospace">
            RAY OPTICS & FOCAL CONVERGENCE (1/f = 1/u + 1/v)
          </text>
          <line x1="25" y1="138" x2="395" y2="138" stroke="#475569" strokeWidth="1.5" />
          <ellipse cx="210" cy="138" rx="14" ry="74" fill="rgba(56,189,248,0.18)" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="92" y1="138" x2="92" y2="82" stroke="#10b981" strokeWidth="4" />
          <polygon points="86,86 92,74 98,86" fill="#10b981" />
          <polyline points="92,82 210,82 342,175" fill="none" stroke="#fbbf24" strokeWidth="2.2" />
          <line x1="92" y1="82" x2="342" y2="175" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="272" cy="138" r="4" fill="#f43f5e" />
          <text x="268" y="154" fill="#fda4af" fontSize="11" fontFamily="monospace">F</text>
          <line x1="342" y1="138" x2="342" y2="175" stroke="#f43f5e" strokeWidth="4" />
        </g>
      )}

      {kind === 'circuit' && (
        <g>
          <text x="24" y="28" fill={accentHex} fontSize="12" fontWeight="700" fontFamily="monospace">
            CLOSED CIRCUIT CURRENT FLOW (V = I · R)
          </text>
          <rect x="74" y="68" width="272" height="136" rx="14" fill="none" stroke="#38bdf8" strokeWidth="3" />
          {/* Battery */}
          <rect x="58" y="114" width="32" height="44" fill="#070e1d" />
          <line x1="64" y1="126" x2="84" y2="126" stroke="#fbbf24" strokeWidth="3.5" />
          <line x1="69" y1="142" x2="79" y2="142" stroke="#fbbf24" strokeWidth="2" />
          {/* Resistor Zigzag */}
          <rect x="160" y="54" width="100" height="28" fill="#070e1d" />
          <polyline points="164,68 176,56 192,80 208,56 224,80 240,56 256,68" fill="none" stroke="#10b981" strokeWidth="2.8" />
          <text x="184" y="100" fill="#6ee7b7" fontSize="11" fontFamily="monospace" fontWeight="700">Load R (Ω)</text>
          {/* Moving Electron Charge */}
          <circle cx={74 + ((stepPhase * 540) % 272)} cy="204" r="5" fill="#22d3ee" />
        </g>
      )}

      {kind === 'chemistry' && (
        <g>
          <text x="24" y="28" fill={accentHex} fontSize="12" fontWeight="700" fontFamily="monospace">
            MOLE CONSERVATION & TITRATION ENDPOINT (C₁V₁ = C₂V₂)
          </text>
          <rect x="195" y="45" width="14" height="82" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
          <polygon points="168,144 236,144 256,214 148,214" fill="rgba(244, 63, 94, 0.28)" stroke="#f43f5e" strokeWidth="2" />
          <circle cx="202" cy={128 + ((stepPhase * 90) % 24)} r="3.5" fill="#38bdf8" />
          <text x="275" y="168" fill="#e2e8f0" fontSize="12" fontFamily="monospace">n = C · V</text>
          <text x="275" y="188" fill="#7dd3fc" fontSize="11" fontFamily="monospace">n_a / n_b = stoich</text>
        </g>
      )}

      {kind === 'biology' && (
        <g>
          <text x="24" y="28" fill={accentHex} fontSize="12" fontWeight="700" fontFamily="monospace">
            SEMI-PERMEABLE MEMBRANE & OSMOSIS FLOW
          </text>
          <rect x="44" y="54" width="150" height="162" rx="10" fill="rgba(56,189,248,0.1)" stroke="#334155" />
          <rect x="226" y="54" width="150" height="162" rx="10" fill="rgba(16,185,129,0.1)" stroke="#334155" />
          <line x1="210" y1="54" x2="210" y2="216" stroke="#fbbf24" strokeWidth="3.5" strokeDasharray="8 6" />
          <text x="64" y="76" fill="#7dd3fc" fontSize="11" fontWeight="700">High Water Ψ</text>
          <text x="246" y="76" fill="#6ee7b7" fontSize="11" fontWeight="700">Low Water Ψ</text>
          <path d="M 150 138 L 268 138" stroke="#22d3ee" strokeWidth="3" />
          <polygon points="264,132 276,138 264,144" fill="#22d3ee" />
          <text x="155" y="126" fill="#e2e8f0" fontSize="10" fontFamily="monospace">Net Osmosis →</text>
        </g>
      )}

      {kind === 'logic' && (
        <g>
          <text x="24" y="28" fill={accentHex} fontSize="12" fontWeight="700" fontFamily="monospace">
            DIGITAL LOGIC GATE & TRUTH EVALUATION
          </text>
          <line x1="65" y1="104" x2="150" y2="104" stroke="#38bdf8" strokeWidth="3" />
          <line x1="65" y1="164" x2="150" y2="164" stroke="#38bdf8" strokeWidth="3" />
          <path d="M 150 82 L 210 82 A 52 52 0 0 1 210 186 L 150 186 Z" fill="#172542" stroke="#10b981" strokeWidth="3" />
          <circle cx="268" cy="134" r="7" fill="#070e1d" stroke="#fbbf24" strokeWidth="2.5" />
          <line x1="275" y1="134" x2="355" y2="134" stroke="#10b981" strokeWidth="3" />
          <text x="42" y="108" fill="#e2e8f0" fontSize="12" fontFamily="monospace">A</text>
          <text x="42" y="168" fill="#e2e8f0" fontSize="12" fontFamily="monospace">B</text>
          <text x="364" y="138" fill="#6ee7b7" fontSize="12" fontWeight="700" fontFamily="monospace">Y</text>
        </g>
      )}

      {kind === 'general' && (
        <g>
          <text x="24" y="28" fill={accentHex} fontSize="12" fontWeight="700" fontFamily="monospace">
            CONCEPT FLOW & WASSCE APPLICATION MAP
          </text>
          {scene.keyPoints.slice(0, 3).map((pt, i) => {
            const y = 52 + i * 62;
            const active = stepPhase >= i / 3;
            return (
              <g key={i}>
                <rect
                  x="28"
                  y={y}
                  width="364"
                  height="48"
                  rx="8"
                  fill={active ? 'rgba(34,211,238,0.14)' : '#0f1b33'}
                  stroke={active ? accentHex : '#334155'}
                  strokeWidth="1.5"
                />
                <text x="42" y={y + 29} fill="#f8fafc" fontSize="11.5" fontWeight="600">
                  {`0${i + 1}. ${pt.length > 52 ? `${pt.slice(0, 50)}...` : pt}`}
                </text>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
};

export const TeacherWorldStage: React.FC<TeacherWorldStageProps> = ({
  scene,
  sceneIdx,
  totalScenes,
  noteTitle,
  subject,
  grade,
  personaId,
  onChangePersona,
  isPlaying,
  isSpeaking,
  syncProgress,
  activeSpokenText,
  showClickToPlayGate,
  onTogglePlay,
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
    }, 140);
    return () => window.clearInterval(id);
  }, [isPlaying, isSpeaking]);

  const illustrationKind = useMemo(
    () => pickIllustrationKind(scene, noteTitle),
    [scene, noteTitle]
  );

  const mouthOpen = isPlaying || isSpeaking ? 3.5 + (animTick % 3) * 2.2 : 1.4;
  const isBlinking = animTick === 16 || animTick === 47;
  const gestureDeg = isPlaying ? Math.sin(syncProgress * Math.PI * 7) * 9 : -4;
  const segs = scene.narrationSegments ?? [];

  return (
    <div
      data-testid="teacher-world-stage"
      className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#070b14] shadow-2xl"
    >
      {/* Classroom World Header Bar */}
      <div className="px-4 py-3 border-b border-slate-800/90 bg-[#0b1324] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/35 flex items-center justify-center text-cyan-300 shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-mono font-bold text-cyan-300 truncate">
              TEACHER&apos;S WORLD STUDIO · SCENE {sceneIdx + 1}/{totalScenes} · {sub.shortName} ({grade})
            </div>
            <h4 className="font-display text-sm sm:text-base font-bold text-white truncate">
              {scene.title}
            </h4>
          </div>
        </div>

        {/* Persona Switcher & Simulation Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-slate-950 border border-slate-800">
            {(['kofi', 'abena', 'efua'] as TeacherPersonaId[]).map((id) => {
              const prof = TEACHER_PERSONA_PROFILES[id];
              const active = id === personaId;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChangePersona(id)}
                  aria-pressed={active}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {prof.name.split(' ').slice(0, 2).join(' ')}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => onToggleSimulation(recommendedSimKind)}
            data-testid="teacher-world-sim-btn"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors whitespace-nowrap ${
              activeSimOpen
                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                : 'bg-cyan-500/15 hover:bg-cyan-500/25 border-cyan-400/50 text-cyan-200'
            }`}
          >
            {activeSimOpen ? <Sparkles className="w-3.5 h-3.5" /> : <FlaskConical className="w-3.5 h-3.5" />}
            <span>{activeSimOpen ? 'Hide Sim' : 'Launch World Sim'}</span>
          </button>
        </div>
      </div>

      {/* Main Classroom World Grid: Human Teacher + Easel Illustration + SmartBoard */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 sm:p-5 bg-gradient-to-b from-[#081020] to-[#050811]">
        {/* Left: Human Teacher Standing at Classroom Podium + Speech Bubble */}
        <div className="lg:col-span-4 rounded-xl border border-slate-800 bg-[#0b1324]/95 p-4 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 font-bold text-white">
              <UserCheck className="w-3.5 h-3.5" style={{ color: persona.accentHex }} />
              <span>{persona.name}</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">{persona.roleTitle}</span>
          </div>

          {/* Full Classroom Teacher SVG Character */}
          <div className="relative mx-auto w-full max-w-[240px] aspect-[4/3] rounded-xl bg-[#060c1a] border border-slate-800 overflow-hidden">
            <svg viewBox="0 0 220 165" className="w-full h-full" aria-hidden="true">
              {/* Classroom window / wall glow */}
              <rect x="8" y="8" width="204" height="106" rx="8" fill="#0b1830" stroke="#1e293b" />
              <line x1="20" y1="26" x2="88" y2="26" stroke={persona.accentHex} strokeOpacity="0.45" strokeWidth="2.5" />
              <line x1="20" y1="38" x2="72" y2="38" stroke="#64748b" strokeOpacity="0.4" strokeWidth="2" />
              <line x1="20" y1="50" x2="82" y2="50" stroke="#64748b" strokeOpacity="0.3" strokeWidth="2" />

              {/* Classroom Desk / Podium */}
              <rect x="14" y="138" width="192" height="27" rx="4" fill="#1e293b" stroke="#334155" />
              <rect x="78" y="128" width="64" height="12" rx="3" fill="#0f172a" stroke="#475569" />

              {/* Teacher Torso */}
              <path d="M 64 138 C 64 98 85 88 110 88 C 135 88 156 98 156 138 Z" fill={persona.shirtHex} />
              <path d="M 99 88 L 110 112 L 121 88 Z" fill="#f8fafc" />
              <path d="M 107.5 92 L 110 124 L 112.5 92 Z" fill={persona.tieHex} />

              {/* Neck & Head */}
              <rect x="102" y="74" width="16" height="16" rx="5" fill={persona.skinHex} />
              <ellipse cx="110" cy="54" rx="20" ry="23" fill={persona.skinHex} />

              {/* Hair */}
              <path
                d={
                  personaId === 'kofi'
                    ? 'M 90 48 C 90 27 130 27 130 48 C 124 36 96 36 90 48 Z'
                    : 'M 88 57 C 86 24 134 24 132 57 C 126 36 94 36 88 57 Z'
                }
                fill={persona.hairHex}
              />

              {/* Eyes */}
              {isBlinking ? (
                <>
                  <line x1="98" y1="52" x2="105" y2="52" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
                  <line x1="115" y1="52" x2="122" y2="52" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <circle cx="102" cy="52" r="2.8" fill="#0f172a" />
                  <circle cx="118" cy="52" r="2.8" fill="#0f172a" />
                  <circle cx="102.8" cy="51" r="0.9" fill="#ffffff" />
                  <circle cx="118.8" cy="51" r="0.9" fill="#ffffff" />
                </>
              )}

              {personaId !== 'kofi' && (
                <g stroke="#e2e8f0" strokeWidth="1.4" fill="none">
                  <rect x="96" y="47" width="11" height="9" rx="2.5" />
                  <rect x="113" y="47" width="11" height="9" rx="2.5" />
                  <line x1="107" y1="51.5" x2="113" y2="51.5" />
                </g>
              )}

              {/* Mouth */}
              <ellipse
                cx="110"
                cy="65"
                rx="6"
                ry={mouthOpen * 0.65}
                fill="#3f1d1d"
                stroke="#fda4af"
                strokeWidth="1"
              />

              {/* Gesturing Pointer Hand toward Visual Easel */}
              <g transform={`translate(142, 108) rotate(${gestureDeg})`}>
                <line x1="0" y1="8" x2="26" y2="-18" stroke={persona.skinHex} strokeWidth="6" strokeLinecap="round" />
                <line x1="22" y1="-14" x2="48" y2="-36" stroke="#fbbf24" strokeWidth="2.4" strokeLinecap="round" />
                <circle cx="49" cy="-37" r="3" fill={persona.accentHex} />
              </g>
            </svg>
          </div>

          {/* Teacher Voice Speech Bubble */}
          <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300">
              <span className="inline-flex items-center gap-1 font-bold">
                <Volume2 className="w-3 h-3" />
                <span>{isPlaying ? 'TEACHING LIVE IN CLASSROOM' : 'READY AT PODIUM'}</span>
              </span>
              <span className="tabular-nums">{Math.round(syncProgress * 100)}%</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed min-h-[54px]">
              {activeSpokenText || scene.intuitionHook}
            </p>
          </div>

          <button
            type="button"
            onClick={onTogglePlay}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Pause Teacher' : 'Click Play to Start Teaching'}</span>
          </button>
        </div>

        {/* Right: Visual Illustration Easel + Synchronized SmartBoard Points */}
        <div className="lg:col-span-8 flex flex-col gap-3.5">
          {/* Animated Contextual Visual Illustration Inside Teacher's World */}
          <div className="rounded-xl border border-slate-700/80 bg-[#070e1d] p-2.5 h-[245px] sm:h-[275px]">
            <WorldVisualEasel
              kind={illustrationKind}
              scene={scene}
              syncProgress={syncProgress}
              accentHex={sub.accentHex}
            />
          </div>

          {/* Synchronized Classroom SmartBoard Key Points */}
          <div className="rounded-xl border border-slate-800 bg-[#0b1324]/95 p-3.5 space-y-2">
            <div className="text-[11px] font-mono font-bold text-slate-400">
              CLASSROOM SMARTBOARD · SYNCHRONIZED STEP-BY-STEP NOTES
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {scene.keyPoints.map((pt, idx) => {
                const seg = segs.find((s) => s.keyPointIndex === idx);
                const startF = seg ? seg.startFrac : idx / Math.max(1, scene.keyPoints.length);
                const endF = seg ? seg.endFrac : 1;
                const isActive = syncProgress >= startF && syncProgress <= endF;
                const isDone = syncProgress > endF;
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border text-xs transition-colors ${
                      isActive
                        ? 'bg-cyan-500/15 border-cyan-400 text-white font-medium'
                        : isDone
                          ? 'bg-slate-900/90 border-emerald-500/35 text-slate-200'
                          : 'bg-slate-950/70 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="font-mono font-bold text-cyan-300 mr-1.5">0{idx + 1}.</span>
                    <span>{pt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Click-to-Play Overlay Gate inside Teacher's World before student clicks Play */}
        {showClickToPlayGate && (
          <div
            data-testid="teacher-world-play-gate"
            className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center"
            style={{ backgroundColor: 'rgba(7, 11, 20, 0.84)' }}
          >
            <div className="max-w-md space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/15 border border-cyan-500/35 text-[11px] font-mono font-bold text-cyan-300">
                <span>TEACHER&apos;S WORLD · {sub.shortName} · {grade}</span>
              </div>
              <h4 className="font-display text-lg font-bold text-white leading-snug">
                {persona.name} is ready in the classroom
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Press Play to hear a continuous, unpaused human-style lesson explaining every formula symbol alongside live visual illustrations.
              </p>
              <button
                type="button"
                data-testid="teacher-world-gate-play-button"
                onClick={onTogglePlay}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg transition-colors"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Click Play to Enter Class</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
