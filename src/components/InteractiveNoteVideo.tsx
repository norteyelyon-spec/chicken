import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookmarkPlus,
  Box,
  CheckCircle2,
  Captions,
  FlaskConical,
  GraduationCap,
  HelpCircle,
  LayoutPanelLeft,
  Lightbulb,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Sparkles,
  Target,
  UserCheck,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { SUBJECTS } from '../data/subjects';
import type {
  SimulatorKind,
  StudyNote,
  SubjectId,
  TeacherPersonaId,
  TeachingLaunchTarget,
} from '../types';
import { LIVE_VOICE_OPTIONS, type LiveVoiceName } from '../utils/liveAudio';
import { pickSimulatorForStudyNote } from '../utils/labPhysics';
import type { NoteDrillAttemptSummary, NoteDrillMasteryRecord } from '../utils/noteDrills';
import {
  buildInteractiveVideoScenes,
  DIMENSION_REFERENCE_ITEMS,
  matchDimensionalQuantity,
  type VideoLessonScene,
} from '../utils/noteVideo';
import {
  fetchTutorSpeechAudio,
  prefetchTutorSpeechAudio,
  speakWithBrowserSpeech,
  type BrowserSpeechPlaybackHandle,
} from '../utils/tutorSpeechClient';
import { AIHumanTeacherPresenter } from './AIHumanTeacherPresenter';
import { LabSimulatorHost } from './LabSimulators';
import { MathText } from './MathText';
import { NoteDrillPanel } from './NoteDrillPanel';
import { TeacherWorldStage } from './TeacherWorldStage';

const VideoLesson3DStage = React.lazy(() =>
  import('./VideoLesson3DStage').then((m) => ({ default: m.VideoLesson3DStage }))
);

interface InteractiveNoteVideoProps {
  note: StudyNote;
  noteMastery?: NoteDrillMasteryRecord;
  teacherPersona?: TeacherPersonaId;
  onChangeTeacherPersona?: (persona: TeacherPersonaId) => void;
  onLogSimulationRun?: (simulatorKind: SimulatorKind, subject: SubjectId) => void;
  onCompleteDrill?: (summary: NoteDrillAttemptSummary) => void;
  onAppendToNote: (markdownSnippet: string) => void;
  onAskTutor?: (prompt: string) => void;
  onLaunchAITeacher?: (target: TeachingLaunchTarget) => void;
}

const EMBEDDED_SIM_OPTIONS: { kind: SimulatorKind; label: string }[] = [
  { kind: 'kinematics-motion', label: 'Kinematics v-t Tracker (Grade 10)' },
  { kind: 'thermal-calorimetry', label: 'Thermal Calorimetry (Grade 10)' },
  { kind: 'ohms-law', label: "Ohm's Law Circuit (Grade 10)" },
  { kind: 'micrometer-3d', label: '3D Micrometer Gauge (Grade 10)' },
  { kind: 'thomson-crt', label: 'Thomson Cathode Ray Tube (Grade 10)' },
  { kind: 'rutherford-scattering', label: 'Rutherford Gold Foil (Grade 10)' },
  { kind: 'osmosis-cell', label: 'Osmosis & Photosynthesis (Grade 10)' },
  { kind: 'simple-machines', label: 'Inclined Plane Machine (Grade 10)' },
  { kind: 'bearings-trig', label: '3-Figure Bearings & Vectors (Grade 11)' },
  { kind: 'electrostatics-field', label: 'Coulomb Electrostatics Field (Grade 11)' },
  { kind: 'projectile-3d', label: '3D Projectile Motion (Grade 11)' },
  { kind: 'optics-3d', label: '3D Convex Lens Bench (Grade 11)' },
  { kind: 'titration', label: 'Acid-Base Titration Lab (Grade 11)' },
  { kind: 'gas-laws', label: 'Boyle & Charles Gas Laws (Grade 11)' },
  { kind: 'enzyme-rate', label: 'Enzyme Kinetics Lab (Grade 11)' },
  { kind: 'logic-gate', label: 'Digital Logic Gates (Grade 11)' },
  { kind: 'ac-transformer-3d', label: 'AC Step-Up/Down Transformer (Grade 12)' },
  { kind: 'genetics-punnett', label: 'Mendelian Punnett Genetics (Grade 12)' },
  { kind: 'pendulum-3d', label: '3D Simple Pendulum (Grade 12)' },
  { kind: 'wave-standing', label: 'Standing Wave Harmonics (Grade 12)' },
  { kind: 'radioactive-decay', label: 'Nuclear Half-Life Decay (Grade 12)' },
  { kind: 'math-function-calc', label: 'Calculus Curve & Integral (Grade 12)' },
];

function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawSceneDiagram(
  ctx: CanvasRenderingContext2D,
  scene: VideoLessonScene,
  progress: number,
  accentHex: string
) {
  const boxX = 770;
  const boxY = 148;
  const boxW = 450;
  const boxH = 440;

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 20);
  ctx.fill();
  ctx.stroke();

  const titleLower = scene.title.toLowerCase();

  if (titleLower.includes('fundamental')) {
    // 3 Base Quantity Pillars: M, L, T -> Derived Force
    const pillars = [
      { sym: 'M', label: 'Mass (kg)', color: '#22d3ee', x: boxX + 82 },
      { sym: 'L', label: 'Length (m)', color: '#34d399', x: boxX + 225 },
      { sym: 'T', label: 'Time (s)', color: '#fbbf24', x: boxX + 368 },
    ];
    pillars.forEach((p, idx) => {
      const reveal = Math.max(0.55, Math.min(1, progress * 4.5 - idx * 0.3));
      ctx.globalAlpha = reveal;
      ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(p.x - 52, boxY + 48, 104, 124, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = p.color;
      ctx.font = '700 42px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(p.sym, p.x, boxY + 114);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '500 14px sans-serif';
      ctx.fillText(p.label, p.x, boxY + 152);
    });

    ctx.globalAlpha = Math.max(0, Math.min(1, progress * 2 - 0.5));
    ctx.strokeStyle = accentHex;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(boxX + 225, boxY + 185);
    ctx.lineTo(boxX + 225, boxY + 250);
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = accentHex;
    ctx.beginPath();
    ctx.roundRect(boxX + 48, boxY + 258, 354, 126, 14);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 20px sans-serif';
    ctx.fillText('Derived Quantity Combination', boxX + 225, boxY + 300);
    ctx.fillStyle = accentHex;
    ctx.font = '700 26px "JetBrains Mono", monospace';
    ctx.fillText('[X] = [Mᵃ Lᵇ Tᶜ]', boxX + 225, boxY + 348);
  } else if (titleLower.includes('homogeneity')) {
    // Balance beam showing LHS = RHS
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PRINCIPLE OF HOMOGENEITY', boxX + 225, boxY + 46);

    const beamY = boxY + 180;
    ctx.strokeStyle = accentHex;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(boxX + 60, beamY);
    ctx.lineTo(boxX + 390, beamY);
    ctx.stroke();

    // Fulcrum triangle
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(boxX + 225, beamY + 4);
    ctx.lineTo(boxX + 195, beamY + 56);
    ctx.lineTo(boxX + 255, beamY + 56);
    ctx.closePath();
    ctx.fill();

    // LHS & RHS boxes
    const cards = [
      { title: 'LHS [s]', val: '[L]', x: boxX + 115 },
      { title: 'RHS [ut] & [½at²]', val: '[L] + [L]', x: boxX + 335 },
    ];
    cards.forEach((c) => {
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(c.x - 75, beamY - 96, 150, 82, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 13px sans-serif';
      ctx.fillText(c.title, c.x, beamY - 64);
      ctx.fillStyle = '#6ee7b7';
      ctx.font = '700 24px "JetBrains Mono", monospace';
      ctx.fillText(c.val, c.x, beamY - 30);
    });

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 17px "JetBrains Mono", monospace';
    ctx.fillText('LHS ≡ RHS  ⇒  VALID', boxX + 225, boxY + 320);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '400 14px sans-serif';
    ctx.fillText('Only identical dimensions can be added', boxX + 225, boxY + 356);
  } else if (titleLower.includes('thomson') || titleLower.includes('plum pudding')) {
    // Thomson Plum Pudding + Cathode Deflection schematic
    ctx.fillStyle = '#f43f5e';
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('THOMSON PLUM PUDDING (1904)', boxX + 225, boxY + 42);

    const cx = boxX + 225;
    const cy = boxY + 215;
    const gradSphere = ctx.createRadialGradient(cx - 25, cy - 25, 12, cx, cy, 115);
    gradSphere.addColorStop(0, 'rgba(251, 113, 133, 0.55)');
    gradSphere.addColorStop(1, 'rgba(190, 18, 60, 0.25)');
    ctx.fillStyle = gradSphere;
    ctx.strokeStyle = '#fb7185';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 110, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Positive signs + embedded negative electrons
    const eOffsets = [
      [-45, -45], [40, -50], [-65, 15], [0, -5], [58, 22], [-25, 62], [32, 60],
    ];
    eOffsets.forEach(([ox, oy], idx) => {
      const jitter = Math.sin(progress * Math.PI * 6 + idx) * 2.5;
      ctx.fillStyle = '#22d3ee';
      ctx.beginPath();
      ctx.arc(cx + ox + jitter, cy + oy - jitter, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#083344';
      ctx.font = '700 13px "JetBrains Mono", monospace';
      ctx.fillText('e⁻', cx + ox + jitter, cy + oy - jitter + 4);
    });
    ctx.fillStyle = '#fda4af';
    ctx.font = '600 14px sans-serif';
    ctx.fillText('Uniform + Sphere with Embedded Electrons', cx, boxY + 372);
  } else if (titleLower.includes('rutherford')) {
    // Rutherford Nuclear Scattering schematic
    ctx.fillStyle = '#10b981';
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('RUTHERFORD GOLD FOIL (1911)', boxX + 225, boxY + 42);

    const nx = boxX + 245;
    const ny = boxY + 215;
    // Empty space atom boundary
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.arc(nx, ny, 128, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Dense positive nucleus
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(nx, ny, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.font = '700 12px monospace';
    ctx.fillText('+', nx, ny + 4);

    // Alpha rays: straight, deflected, backscattered
    const rays = [
      { y: ny - 85, bend: 0 },
      { y: ny - 32, bend: -52 },
      { y: ny + 4, bend: 180 },
      { y: ny + 38, bend: 48 },
      { y: ny + 88, bend: 0 },
    ];
    rays.forEach((ray) => {
      ctx.strokeStyle = ray.bend === 180 ? '#f43f5e' : '#34d399';
      ctx.lineWidth = ray.bend === 180 ? 3 : 2;
      ctx.beginPath();
      ctx.moveTo(boxX + 45, ray.y);
      if (ray.bend === 180) {
        ctx.lineTo(nx - 24, ny);
        ctx.lineTo(boxX + 55, ny + 60);
      } else if (ray.bend !== 0) {
        ctx.quadraticCurveTo(nx, ray.y, boxX + 410, ray.y + ray.bend);
      } else {
        ctx.lineTo(boxX + 410, ray.y);
      }
      ctx.stroke();
    });
    ctx.fillStyle = '#a7f3d0';
    ctx.font = '600 14px sans-serif';
    ctx.fillText('1 in 8,000 α-particles backscatter (>90°)', boxX + 225, boxY + 380);
  } else if (titleLower.includes('bohr') || titleLower.includes('quantum') || titleLower.includes('orbital')) {
    // Bohr Quantized Shells + Photon Transition
    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('QUANTIZED ENERGY SHELLS (n=1,2,3)', boxX + 225, boxY + 42);

    const cx = boxX + 225;
    const cy = boxY + 215;
    [48, 86, 124].forEach((r, idx) => {
      ctx.strokeStyle = idx === 0 ? '#22d3ee' : idx === 1 ? '#34d399' : '#a78bfa';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      const ang = progress * Math.PI * 2 * (3 - idx) * 0.5 + idx;
      const ex = cx + Math.cos(ang) * r;
      const ey = cy + Math.sin(ang) * r;
      ctx.fillStyle = '#67e8f9';
      ctx.beginPath();
      ctx.arc(ex, ey, 6.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 14px "JetBrains Mono", monospace';
    ctx.fillText('ΔE = E_upper − E_lower = hf', cx, boxY + 382);
  } else if (
    titleLower.includes('microscope') ||
    titleLower.includes('wet mount') ||
    titleLower.includes('cell')
  ) {
    // Compound Optical Light Path + 45 deg Wet Mount schematic
    ctx.fillStyle = '#84cc16';
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('MICROSCOPY & OPTICAL MAGNIFICATION', boxX + 225, boxY + 42);

    const cx = boxX + 225;
    // Eyepiece lens
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(cx - 38, boxY + 70, 76, 36, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#e0f2fe';
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillText('Eyepiece ×10', cx, boxY + 93);

    // Objective lens
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#84cc16';
    ctx.beginPath();
    ctx.roundRect(cx - 28, boxY + 158, 56, 38, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ecfccb';
    ctx.fillText('Obj ×40', cx, boxY + 182);

    // Ray cone animation
    const rayAlpha = 0.45 + 0.45 * Math.sin(progress * Math.PI * 3);
    ctx.strokeStyle = `rgba(132, 204, 22, ${rayAlpha.toFixed(2)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 24, boxY + 106);
    ctx.lineTo(cx - 12, boxY + 158);
    ctx.lineTo(cx - 46, boxY + 258);
    ctx.moveTo(cx + 24, boxY + 106);
    ctx.lineTo(cx + 12, boxY + 158);
    ctx.lineTo(cx + 46, boxY + 258);
    ctx.stroke();

    // Slide & 45 deg coverslip
    ctx.fillStyle = 'rgba(30, 41, 59, 0.95)';
    ctx.strokeStyle = '#94a3b8';
    ctx.beginPath();
    ctx.roundRect(cx - 120, boxY + 258, 240, 26, 6);
    ctx.fill();
    ctx.stroke();

    // Angled coverslip lowering at 45 deg
    const angleProgress = Math.max(0.15, Math.min(0.75, 0.75 - progress * 0.45));
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 28, boxY + 258);
    ctx.lineTo(cx - 28 + Math.cos(angleProgress) * 68, boxY + 258 - Math.sin(angleProgress) * 68);
    ctx.stroke();

    ctx.fillStyle = '#bef264';
    ctx.font = '600 15px "JetBrains Mono", monospace';
    ctx.fillText('Total Mag = ×10 × ×40 = ×400', cx, boxY + 340);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '400 13px sans-serif';
    ctx.fillText('Lower coverslip at 45° to avoid air bubbles', cx, boxY + 372);
  } else if (
    titleLower.includes('symmetry') ||
    titleLower.includes('orientation') ||
    titleLower.includes('drawing')
  ) {
    ctx.fillStyle = '#84cc16';
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SYMMETRY & SECTIONING PLANES', boxX + 225, boxY + 42);

    // Bilateral organism outline + vertical line
    const lx = boxX + 125;
    const cy = boxY + 200;
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(lx, cy, 48, 84, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(lx, cy - 102);
    ctx.lineTo(lx, cy + 102);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 13px sans-serif';
    ctx.fillText('Bilateral (1 plane)', lx, cy + 128);

    // Radial organism + multiple axes
    const rx = boxX + 325;
    ctx.strokeStyle = '#84cc16';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(rx, cy, 66, 0, Math.PI * 2);
    ctx.stroke();
    for (let a = 0; a < 4; a++) {
      const theta = (a * Math.PI) / 4 + progress * 0.25;
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)';
      ctx.beginPath();
      ctx.moveTo(rx - Math.cos(theta) * 76, cy - Math.sin(theta) * 76);
      ctx.lineTo(rx + Math.cos(theta) * 76, cy + Math.sin(theta) * 76);
      ctx.stroke();
    }
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('Radial (>1 planes)', rx, cy + 128);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 13px monospace';
    ctx.fillText('L.S. (Longitudinal) · T.S. (Transverse) · V.S.', boxX + 225, boxY + 382);
  } else if (
    titleLower.includes('calculus') ||
    titleLower.includes('differentiation') ||
    titleLower.includes('integral') ||
    titleLower.includes('trig')
  ) {
    ctx.fillStyle = '#a78bfa';
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ANALYTICAL CURVE & GRADIENT TRACE', boxX + 225, boxY + 42);

    const ox = boxX + 55;
    const oy = boxY + 290;
    const plotW = 340;
    // Axes
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ox, boxY + 80);
    ctx.lineTo(ox, oy + 20);
    ctx.moveTo(ox - 15, oy);
    ctx.lineTo(ox + plotW, oy);
    ctx.stroke();

    // Curve
    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px <= plotW - 20; px += 4) {
      const t = px / (plotW - 20);
      const yVal = Math.sin(t * Math.PI * 1.4) * 115 + t * 55;
      if (px === 0) ctx.moveTo(ox + px, oy - yVal);
      else ctx.lineTo(ox + px, oy - yVal);
    }
    ctx.stroke();

    // Moving tangent point
    const pt = Math.max(0.1, Math.min(0.9, progress));
    const px = pt * (plotW - 20);
    const py = Math.sin(pt * Math.PI * 1.4) * 115 + pt * 55;
    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.arc(ox + px, oy - py, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 14px "JetBrains Mono", monospace';
    ctx.fillText('dy/dx = slope  ·  ∫ y dx = bounded area', boxX + 225, boxY + 372);
  } else if (titleLower.includes('mass spec') || titleLower.includes('isotope') || titleLower.includes('deflection')) {
    ctx.fillStyle = '#22d3ee';
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('MASS SPECTROMETER (m/z DEFLECTION)', boxX + 225, boxY + 42);

    const startX = boxX + 70;
    const startY = boxY + 290;
    // Magnet block
    ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(boxX + 145, boxY + 110, 140, 150, 18);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#bae6fd';
    ctx.font = '600 12px monospace';
    ctx.fillText('B-FIELD', boxX + 215, boxY + 190);

    // Light vs Heavy ion trajectories
    const paths = [
      { label: 'Light m/z (more curve)', ctrlX: boxX + 185, ctrlY: boxY + 125, endX: boxX + 365, endY: boxY + 95, color: '#22d3ee' },
      { label: 'Heavy m/z (less curve)', ctrlX: boxX + 240, ctrlY: boxY + 185, endX: boxX + 385, endY: boxY + 185, color: '#fbbf24' },
    ];
    paths.forEach((p) => {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(p.ctrlX, p.ctrlY, p.endX, p.endY);
      ctx.stroke();
      ctx.fillStyle = p.color;
      ctx.font = '600 12px sans-serif';
      ctx.fillText(p.label, p.endX - 45, p.endY - 10);
    });
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillText('Vaporize → Ionize → Accelerate → Deflect → Detect', boxX + 225, boxY + 372);
  } else if (titleLower.includes('radioactiv') || titleLower.includes('alpha') || titleLower.includes('half-life')) {
    ctx.fillStyle = '#f59e0b';
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PENETRATING POWER: α, β, γ RADIATION', boxX + 225, boxY + 42);

    const barriers = [
      { label: 'Paper', x: boxX + 150, h: 190, color: '#e2e8f0' },
      { label: 'Al (5mm)', x: boxX + 240, h: 190, color: '#38bdf8' },
      { label: 'Lead (Pb)', x: boxX + 335, h: 190, color: '#a78bfa' },
    ];
    barriers.forEach((b) => {
      ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
      ctx.strokeStyle = b.color;
      ctx.lineWidth = 2;
      ctx.fillRect(b.x, boxY + 105, 16, b.h);
      ctx.strokeRect(b.x, boxY + 105, 16, b.h);
      ctx.fillStyle = b.color;
      ctx.font = '600 12px sans-serif';
      ctx.fillText(b.label, b.x + 8, boxY + 318);
    });

    const rays = [
      { name: 'α (⁴₂He)', y: boxY + 135, endX: boxX + 150, color: '#f43f5e' },
      { name: 'β (⁰₋₁e)', y: boxY + 195, endX: boxX + 240, color: '#34d399' },
      { name: 'γ (Photon)', y: boxY + 255, endX: boxX + 410, color: '#fbbf24' },
    ];
    rays.forEach((r) => {
      const tipX = boxX + 55 + (r.endX - (boxX + 55)) * Math.min(1, 0.35 + progress * 0.85);
      ctx.strokeStyle = r.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(boxX + 55, r.y);
      ctx.lineTo(tipX, r.y);
      ctx.stroke();
      ctx.fillStyle = r.color;
      ctx.font = '700 13px "JetBrains Mono", monospace';
      ctx.fillText(r.name, boxX + 82, r.y - 10);
    });
    ctx.fillStyle = '#fde68a';
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillText('N(t) = N₀ · (½)^(t / t½)', boxX + 225, boxY + 372);
  } else if (titleLower.includes('safety') || titleLower.includes('hazard') || titleLower.includes('compatibility') || titleLower.includes('fire')) {
    ctx.fillStyle = '#fb7185';
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('LAB HAZARD COMPATIBILITY & PASS FIRE CONTROL', boxX + 225, boxY + 42);

    const pills = [
      { label: 'Store by Compatibility', desc: 'Separate Acids, Alkalis & Oxidizers', color: '#22d3ee', y: boxY + 86 },
      { label: 'Dilution Safety Rule', desc: 'Always Pour Acid SLOWLY into Water', color: '#34d399', y: boxY + 180 },
      { label: 'Fire Extinguisher PASS', desc: 'Pull · Aim · Squeeze · Sweep', color: '#f59e0b', y: boxY + 274 },
    ];
    pills.forEach((item) => {
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(boxX + 36, item.y, boxW - 72, 74, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = item.color;
      ctx.font = '700 15px "JetBrains Mono", monospace';
      ctx.fillText(item.label, boxX + 225, item.y + 30);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '500 13px sans-serif';
      ctx.fillText(item.desc, boxX + 225, item.y + 56);
    });
  } else if (titleLower.includes('venn') || titleLower.includes('set') || titleLower.includes('union') || titleLower.includes('intersection')) {
    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SET OPERATIONS & VENN DIAGRAM', boxX + 225, boxY + 42);

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX + 36, boxY + 68, 378, 250);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 14px monospace';
    ctx.fillText('U (Universal)', boxX + 94, boxY + 90);

    const cx1 = boxX + 175;
    const cx2 = boxX + 275;
    const cy = boxY + 195;
    ctx.fillStyle = 'rgba(34, 211, 238, 0.16)';
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx1, cy, 86, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(52, 211, 153, 0.16)';
    ctx.strokeStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(cx2, cy, 86, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 16px "JetBrains Mono", monospace';
    ctx.fillText('A', cx1 - 36, cy + 5);
    ctx.fillText('A∩B', boxX + 225, cy + 5);
    ctx.fillText('B', cx2 + 36, cy + 5);

    ctx.fillStyle = '#bae6fd';
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillText('n(A∪B) = n(A) + n(B) − n(A∩B)', boxX + 225, boxY + 368);
  } else if (titleLower.includes('logic') || titleLower.includes('boolean') || titleLower.includes('gate') || titleLower.includes('network') || titleLower.includes('topology') || titleLower.includes('osi')) {
    ctx.fillStyle = '#22d3ee';
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('DIGITAL LOGIC & NETWORK ARCHITECTURE', boxX + 225, boxY + 42);

    // Draw NAND gate + Star network nodes
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(boxX + 90, boxY + 100);
    ctx.lineTo(boxX + 140, boxY + 100);
    ctx.moveTo(boxX + 90, boxY + 148);
    ctx.lineTo(boxX + 140, boxY + 148);
    ctx.stroke();

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(boxX + 140, boxY + 84);
    ctx.lineTo(boxX + 185, boxY + 84);
    ctx.arc(boxX + 185, boxY + 124, 40, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(boxX + 140, boxY + 164);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(boxX + 233, boxY + 124, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(boxX + 240, boxY + 124);
    ctx.lineTo(boxX + 350, boxY + 124);
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillText('A,B', boxX + 70, boxY + 128);
    ctx.fillText('Y = ¬(A·B)', boxX + 305, boxY + 110);

    // OSI / Packet hop boxes below
    const hops = ['App', 'Transport', 'IP Net', 'Link'];
    hops.forEach((hName, hIdx) => {
      const hx = boxX + 46 + hIdx * 92;
      const hy = boxY + 235;
      const activeHop = Math.floor(progress * 4) % 4 === hIdx;
      ctx.fillStyle = activeHop ? 'rgba(34, 211, 238, 0.22)' : '#1e293b';
      ctx.strokeStyle = activeHop ? '#22d3ee' : '#475569';
      ctx.beginPath();
      ctx.roundRect(hx, hy, 80, 56, 10);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f8fafc';
      ctx.font = '600 12px monospace';
      ctx.fillText(hName, hx + 40, hy + 32);
    });
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillText('¬(A·B) = ¬A + ¬B  (De Morgan)', boxX + 225, boxY + 365);
  } else if (titleLower.includes('osmosis') || titleLower.includes('diffusion') || titleLower.includes('circulation') || titleLower.includes('heart') || titleLower.includes('respir') || titleLower.includes('ecology') || titleLower.includes('photosynth')) {
    ctx.fillStyle = '#84cc16';
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BIOLOGICAL MEMBRANE & PHYSIOLOGY FLOW', boxX + 225, boxY + 42);

    // Semi-permeable membrane separating dilute & concentrated solutions
    ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
    ctx.fillRect(boxX + 48, boxY + 86, 165, 200);
    ctx.fillStyle = 'rgba(251, 191, 36, 0.14)';
    ctx.fillRect(boxX + 237, boxY + 86, 165, 200);

    ctx.setLineDash([7, 6]);
    ctx.strokeStyle = '#a3e635';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(boxX + 225, boxY + 82);
    ctx.lineTo(boxX + 225, boxY + 292);
    ctx.stroke();
    ctx.setLineDash([]);

    const arrowX = boxX + 150 + Math.min(1, progress) * 145;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(arrowX, boxY + 186, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#bae6fd';
    ctx.font = '600 13px sans-serif';
    ctx.fillText('High Water Potential', boxX + 130, boxY + 112);
    ctx.fillStyle = '#fde68a';
    ctx.fillText('Low Water Potential', boxX + 320, boxY + 112);
    ctx.fillStyle = '#ecfccb';
    ctx.font = '600 14px "JetBrains Mono", monospace';
    ctx.fillText('H₂O moves across semi-permeable membrane', boxX + 225, boxY + 355);
  } else if (titleLower.includes('titration') || titleLower.includes('acid') || titleLower.includes('base') || titleLower.includes('electro') || titleLower.includes('equilibrium') || titleLower.includes('bond') || titleLower.includes('haber') || titleLower.includes('alkane')) {
    ctx.fillStyle = '#34d399';
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('REACTION EQUILIBRIUM & VOLUMETRIC SYSTEM', boxX + 225, boxY + 42);

    // Burette + Conical Flask / Electrolytic cell visual
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(boxX + 210, boxY + 72, 30, 108);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.fillRect(boxX + 212, boxY + 95, 26, 83);

    // Droplet falling
    const dropY = boxY + 188 + (progress * 140) % 44;
    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.arc(boxX + 225, dropY, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Conical flask
    ctx.strokeStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(boxX + 205, boxY + 218);
    ctx.lineTo(boxX + 140, boxY + 318);
    ctx.lineTo(boxX + 310, boxY + 318);
    ctx.lineTo(boxX + 245, boxY + 218);
    ctx.stroke();

    ctx.fillStyle = progress > 0.65 ? 'rgba(244, 114, 182, 0.4)' : 'rgba(56, 189, 248, 0.24)';
    ctx.beginPath();
    ctx.moveTo(boxX + 162, boxY + 284);
    ctx.lineTo(boxX + 144, boxY + 316);
    ctx.lineTo(boxX + 306, boxY + 316);
    ctx.lineTo(boxX + 288, boxY + 284);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#a7f3d0';
    ctx.font = '600 14px "JetBrains Mono", monospace';
    ctx.fillText('CₐVₐ / C_bV_b = nₐ / n_b   ·   pH = −log[H⁺]', boxX + 225, boxY + 368);
  } else if (titleLower.includes('circle') || titleLower.includes('theorem') || titleLower.includes('angle') || titleLower.includes('geometry') || titleLower.includes('vector') || titleLower.includes('bearing')) {
    ctx.fillStyle = '#c084fc';
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('EUCLIDEAN CIRCLE & ANGLE GEOMETRY', boxX + 225, boxY + 42);

    const cx = boxX + 225;
    const cy = boxY + 206;
    const r = 104;
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    const ax = cx + Math.cos(2.4) * r;
    const ay = cy + Math.sin(2.4) * r;
    const bx = cx + Math.cos(0.75) * r;
    const by = cy + Math.sin(0.75) * r;
    const tx = cx + Math.cos(-1.35) * r;
    const ty = cy + Math.sin(-1.35) * r;

    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(cx, cy);
    ctx.lineTo(bx, by);
    ctx.stroke();

    ctx.strokeStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(tx, ty);
    ctx.lineTo(bx, by);
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 14px monospace';
    ctx.fillText('2θ', cx, cy - 12);
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('θ', tx + 8, ty + 24);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillText('Angle at Centre = 2 × Angle at Circumference', boxX + 225, boxY + 368);
  } else if (titleLower.includes('ohm') || titleLower.includes('circuit') || titleLower.includes('wave') || titleLower.includes('harmonic') || titleLower.includes('optic') || titleLower.includes('lens') || titleLower.includes('magnet') || titleLower.includes('induc')) {
    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('WAVEFORM & ELECTROMAGNETIC SIGNAL', boxX + 225, boxY + 42);

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(boxX + 44, boxY + 205);
    ctx.lineTo(boxX + 406, boxY + 205);
    ctx.stroke();

    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x <= 350; x += 4) {
      const y = Math.sin((x / 350) * Math.PI * 4 - progress * Math.PI * 4) * 72;
      if (x === 0) ctx.moveTo(boxX + 50 + x, boxY + 205 + y);
      else ctx.lineTo(boxX + 50 + x, boxY + 205 + y);
    }
    ctx.stroke();

    ctx.fillStyle = '#bae6fd';
    ctx.font = '600 14px "JetBrains Mono", monospace';
    ctx.fillText('v = fλ   ·   V = IR   ·   e = −N dΦ/dt', boxX + 225, boxY + 365);
  } else if (titleLower.includes('concord') || titleLower.includes('grammar') || titleLower.includes('vowel') || titleLower.includes('intonation') || titleLower.includes('stress') || titleLower.includes('literature') || titleLower.includes('essay') || titleLower.includes('summary')) {
    ctx.fillStyle = '#f472b6';
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SYNTAX STRUCTURE & ORAL INTONATION MAP', boxX + 225, boxY + 42);

    const steps = [
      { label: 'Subject / Clause', val: 'Head + Modifiers (Number Match)', color: '#22d3ee', y: boxY + 86 },
      { label: 'Predicate / Verb', val: 'Tense + Concord + Active/Passive Voice', color: '#f472b6', y: boxY + 178 },
      { label: 'Oral Tune 1 ↘ / Tune 2 ↗', val: 'Falling (Statements) vs Rising (Yes/No)', color: '#fbbf24', y: boxY + 270 },
    ];
    steps.forEach((item) => {
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(boxX + 36, item.y, boxW - 72, 72, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = item.color;
      ctx.font = '700 14px "JetBrains Mono", monospace';
      ctx.fillText(item.label, boxX + 225, item.y + 28);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '500 13px sans-serif';
      ctx.fillText(item.val, boxX + 225, item.y + 52);
    });
  } else if (titleLower.includes('constitution') || titleLower.includes('governance') || titleLower.includes('democracy') || titleLower.includes('ecowas') || titleLower.includes('machine') || titleLower.includes('pulley') || titleLower.includes('soil')) {
    ctx.fillStyle = '#fb923c';
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SYSTEM ARCHITECTURE & EQUILIBRIUM TRIAD', boxX + 225, boxY + 42);

    const nodes = [
      { label: 'Executive / Input', x: boxX + 225, y: boxY + 106, c: '#22d3ee' },
      { label: 'Legislature / Effort', x: boxX + 115, y: boxY + 258, c: '#34d399' },
      { label: 'Judiciary / Output', x: boxX + 335, y: boxY + 258, c: '#fbbf24' },
    ];
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(nodes[0].x, nodes[0].y);
    ctx.lineTo(nodes[1].x, nodes[1].y);
    ctx.lineTo(nodes[2].x, nodes[2].y);
    ctx.closePath();
    ctx.stroke();

    nodes.forEach((nd) => {
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = nd.c;
      ctx.beginPath();
      ctx.roundRect(nd.x - 74, nd.y - 26, 148, 52, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f8fafc';
      ctx.font = '600 13px sans-serif';
      ctx.fillText(nd.label, nd.x, nd.y + 5);
    });
    ctx.fillStyle = '#fed7aa';
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillText('Mutual Checks, Balance & Efficiency (MA/VR)', boxX + 225, boxY + 368);
  } else {
    // Visual Equation / Concept Matrix Diagram
    ctx.fillStyle = accentHex;
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(scene.visualBadge.toUpperCase(), boxX + 28, boxY + 44);

    if (scene.equations.length > 0) {
      scene.equations.slice(0, 3).forEach((eq, i) => {
        const cardY = boxY + 72 + i * 112;
        const alpha = Math.max(0.25, Math.min(1, progress * 2.5 - i * 0.35));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = accentHex;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(boxX + 26, cardY, boxW - 52, 90, 14);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 20px "JetBrains Mono", monospace';
        const wrapped = wrapTextLines(ctx, eq, boxW - 88);
        wrapped.slice(0, 2).forEach((line, li) => {
          ctx.fillText(line, boxX + 44, cardY + 38 + li * 28);
        });
      });
    } else {
      // Concept Node Graph
      const nodes = scene.keyPoints.slice(0, 3);
      nodes.forEach((pt, i) => {
        const ny = boxY + 78 + i * 114;
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(boxX + 26, ny, boxW - 52, 92, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = '700 14px "JetBrains Mono", monospace';
        ctx.fillText(`0${i + 1}`, boxX + 44, ny + 32);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '500 15px sans-serif';
        const lines = wrapTextLines(ctx, pt, boxW - 110);
        lines.slice(0, 2).forEach((ln, li) => {
          ctx.fillText(ln, boxX + 82, ny + 34 + li * 24);
        });
      });
    }
  }
  ctx.restore();
}

export const InteractiveNoteVideo: React.FC<InteractiveNoteVideoProps> = ({
  note,
  noteMastery,
  teacherPersona: controlledPersona,
  onChangeTeacherPersona,
  onLogSimulationRun,
  onCompleteDrill,
  onAppendToNote,
  onAskTutor,
  onLaunchAITeacher,
}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scenes = useMemo(() => buildInteractiveVideoScenes(note), [note.id, note.title, note.content]);
  const subjectInfo = SUBJECTS[note.subject];
  const recommendedSimKind = useMemo(
    () => pickSimulatorForStudyNote(note.subject, note.title),
    [note.subject, note.title]
  );

  const [internalPersona, setInternalPersona] = useState<TeacherPersonaId>('kofi');
  const activePersona = controlledPersona ?? internalPersona;
  const handlePersonaChange = (p: TeacherPersonaId) => {
    setInternalPersona(p);
    onChangeTeacherPersona?.(p);
  };

  const [showHumanTeacher, setShowHumanTeacher] = useState(true);
  const [activeEmbeddedSim, setActiveEmbeddedSim] = useState<SimulatorKind | null>(null);

  const [sceneIdx, setSceneIdx] = useState(0);
  const [sceneElapsed, setSceneElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stageMode, setStageMode] = useState<'split' | '3d' | 'board' | 'teacher-world' | 'drill'>('split');
  const [playbackRate, setPlaybackRate] = useState<1 | 1.25 | 1.5>(1);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState<LiveVoiceName>('Kore');
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'loading' | 'playing' | 'blocked' | 'fallback'>('idle');
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [autoPauseAtCheckpoints, setAutoPauseAtCheckpoints] = useState(false);

  const [completedCheckpoints, setCompletedCheckpoints] = useState<Record<string, number>>({});
  const [bookmarkText, setBookmarkText] = useState('');
  const [bookmarkSavedMsg, setBookmarkSavedMsg] = useState<string | null>(null);
  const [audioSyncFrac, setAudioSyncFrac] = useState<number | null>(null);
  const [spokenChunkText, setSpokenChunkText] = useState<string | null>(null);

  // Interactive Dimensional Equation Sandbox state
  const [expM, setExpM] = useState(1);
  const [expL, setExpL] = useState(1);
  const [expT, setExpT] = useState(-2);
  const matchedDim = useMemo(() => matchDimensionalQuantity(expM, expL, expT), [expM, expL, expT]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const browserSpeechRef = useRef<BrowserSpeechPlaybackHandle | null>(null);
  const isVoiceActivelySpeakingRef = useRef(false);
  const playbackRateRef = useRef<number>(playbackRate);
  playbackRateRef.current = playbackRate;

  // Enforce strict Click-to-Play gate and reset timeline whenever switching notes
  useEffect(() => {
    setIsPlaying(false);
    setSceneIdx(0);
    setSceneElapsed(0);
    setCompletedCheckpoints({});
    setAudioSyncFrac(null);
    setSpokenChunkText(null);
    setStageMode('split');
    setActiveEmbeddedSim(null);
  }, [note.id]);

  const activeScene = scenes[sceneIdx] ?? scenes[0];

  // Sync audio playbackRate cleanly without re-fetching
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Unlock blocked autoplay automatically on first user gesture anywhere in the viewport
  useEffect(() => {
    if (voiceStatus !== 'blocked') return;
    const tryUnlock = () => {
      const audio = audioRef.current;
      if (audio) {
        void audio.play().then(() => setVoiceStatus('playing')).catch(() => {});
      }
    };
    window.addEventListener('pointerdown', tryUnlock, { once: true });
    window.addEventListener('keydown', tryUnlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', tryUnlock);
      window.removeEventListener('keydown', tryUnlock);
    };
  }, [voiceStatus]);

  // Real Gemini AI Teacher Voice via /api/tutor/speak with pre-buffered next scenes & 1:1 synced SpeechSynthesis fallback
  useEffect(() => {
    if (browserSpeechRef.current) {
      browserSpeechRef.current.cancel();
      browserSpeechRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    isVoiceActivelySpeakingRef.current = false;
    setAudioSyncFrac(null);
    setSpokenChunkText(null);

    if (!voiceEnabled || !isPlaying || !activeScene) {
      setVoiceStatus('idle');
      return;
    }

    // Pre-buffer next 2 scenes for zero-gap transitions
    for (const offset of [1, 2]) {
      const nextSc = scenes[sceneIdx + offset];
      if (nextSc?.narration) {
        prefetchTutorSpeechAudio({
          text: nextSc.narration,
          voiceName: selectedVoice,
          style: `Warm, clear Ghanaian Senior High School ${subjectInfo.name} teacher`,
        });
      }
    }

    const controller = new AbortController();
    let cancelled = false;
    setVoiceStatus('loading');
    isVoiceActivelySpeakingRef.current = true;

    const runBrowserSyncSpeech = () => {
      if (cancelled) return;
      browserSpeechRef.current = speakWithBrowserSpeech({
        text: activeScene.narration,
        rate: playbackRateRef.current,
        onStart: () => {
          isVoiceActivelySpeakingRef.current = true;
          if (!cancelled) setVoiceStatus('fallback');
        },
        onChunkStart: (chunkIdx, totalChunks, chunkText) => {
          if (cancelled) return;
          isVoiceActivelySpeakingRef.current = true;
          setVoiceStatus('fallback');
          setAudioSyncFrac((chunkIdx + 0.35) / Math.max(1, totalChunks));
          setSpokenChunkText(chunkText);
        },
        onEnd: () => {
          isVoiceActivelySpeakingRef.current = false;
          if (!cancelled) {
            setAudioSyncFrac(1);
            setVoiceStatus('idle');
          }
        },
        onError: () => {
          isVoiceActivelySpeakingRef.current = false;
          if (!cancelled) setVoiceStatus('idle');
        },
      });
      if (!cancelled) setVoiceStatus('fallback');
    };

    const startSpeech = async () => {
      try {
        const { dataUrl, fallbackToBrowser } = await fetchTutorSpeechAudio({
          text: activeScene.narration,
          voiceName: selectedVoice,
          style: `Warm, clear Ghanaian Senior High School ${subjectInfo.name} teacher`,
          signal: controller.signal,
        });
        if (cancelled) return;
        if (fallbackToBrowser || !dataUrl) {
          runBrowserSyncSpeech();
          return;
        }
        const audio = new Audio(dataUrl);
        audio.playbackRate = playbackRateRef.current;
        audioRef.current = audio;
        audio.ontimeupdate = () => {
          if (cancelled || !audio.duration) return;
          const frac = Math.min(1, Math.max(0, audio.currentTime / audio.duration));
          setAudioSyncFrac(frac);
        };
        audio.onended = () => {
          isVoiceActivelySpeakingRef.current = false;
          if (!cancelled) {
            setAudioSyncFrac(1);
            setVoiceStatus('idle');
          }
        };
        try {
          await audio.play();
          if (!cancelled) setVoiceStatus('playing');
        } catch {
          isVoiceActivelySpeakingRef.current = false;
          if (!cancelled) setVoiceStatus('blocked');
        }
      } catch (err) {
        if (cancelled || (err as Error)?.name === 'AbortError') {
          isVoiceActivelySpeakingRef.current = false;
          return;
        }
        runBrowserSyncSpeech();
      }
    };

    void startSpeech();

    return () => {
      cancelled = true;
      isVoiceActivelySpeakingRef.current = false;
      controller.abort();
      if (browserSpeechRef.current) {
        browserSpeechRef.current.cancel();
        browserSpeechRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceEnabled, isPlaying, activeScene?.id, selectedVoice, subjectInfo.name]);

  // Synchronized Playback Timer Loop — continuously advances scenes without stalling after teacher narration finishes
  useEffect(() => {
    if (!isPlaying || !activeScene) return;
    let rafId = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000) * playbackRate;
      last = now;

      setSceneElapsed((prev) => {
        const next = prev + dt;
        const narrationStillActive =
          voiceEnabled &&
          isVoiceActivelySpeakingRef.current &&
          next < activeScene.durationSeconds + 50;

        if (next >= activeScene.durationSeconds && !narrationStillActive) {
          const needsCheckpoint =
            autoPauseAtCheckpoints &&
            activeScene.checkpoint &&
            completedCheckpoints[activeScene.id] === undefined;

          if (needsCheckpoint) {
            setIsPlaying(false);
            return activeScene.durationSeconds;
          }

          if (sceneIdx < scenes.length - 1) {
            setSceneIdx((i) => i + 1);
            return 0;
          }
          setIsPlaying(false);
          return activeScene.durationSeconds;
        }
        return Math.min(next, activeScene.durationSeconds + 50);
      });

      rafId = window.requestAnimationFrame(step);
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [
    isPlaying,
    activeScene,
    playbackRate,
    voiceEnabled,
    sceneIdx,
    scenes.length,
    autoPauseAtCheckpoints,
    completedCheckpoints,
  ]);

  // Master audio-aligned progress (0..1): uses real audio/chunk progress when speaking, timer progress otherwise
  const timerProgress = Math.min(1, sceneElapsed / Math.max(1, activeScene?.durationSeconds ?? 1));
  const syncProgress =
    voiceEnabled && isPlaying && audioSyncFrac !== null ? audioSyncFrac : timerProgress;

  const activeNarrationSegment = useMemo(() => {
    const segs = activeScene?.narrationSegments ?? [];
    if (segs.length === 0) return null;
    return (
      segs.find((s) => syncProgress >= s.startFrac && syncProgress <= s.endFrac) ??
      segs[segs.length - 1]
    );
  }, [activeScene, syncProgress]);

  // Draw 1280x720 Animated Whiteboard Lesson Frame Synchronized 1:1 With Audio
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !activeScene) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const progress = syncProgress;

    // Studio Blackboard Gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#070b14');
    grad.addColorStop(1, '#0e1729');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle Drafting Grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Top Header Banner
    ctx.fillStyle = subjectInfo.accentHex;
    ctx.font = '700 16px "JetBrains Mono", monospace';
    ctx.fillText(
      `SCENE ${sceneIdx + 1} / ${scenes.length}  ·  ${subjectInfo.shortName.toUpperCase()}  ·  ${note.grade}`,
      56,
      58
    );

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 34px sans-serif';
    const titleLines = wrapTextLines(ctx, activeScene.title, 680);
    titleLines.slice(0, 2).forEach((line, li) => {
      ctx.fillText(line, 56, 104 + li * 40);
    });

    // Synchronized Chalkboard Writing — highlights & reveals each point as the AI Teacher speaks it
    const segs = activeScene.narrationSegments ?? [];
    const startY = 178 + (titleLines.length > 1 ? 26 : 0);
    let cursorY = startY;
    activeScene.keyPoints.forEach((pt, idx) => {
      const seg = segs.find((s) => s.keyPointIndex === idx);
      const startFrac = seg ? seg.startFrac : (idx / Math.max(1, activeScene.keyPoints.length)) * 0.85;
      const endFrac = seg ? seg.endFrac : Math.min(1, startFrac + 0.18);

      const isCurrentlySpoken = progress >= startFrac && progress <= endFrac;
      const isAlreadySpoken = progress > endFrac;
      const localRevealFrac = isCurrentlySpoken
        ? Math.min(1, Math.max(0.22, (progress - startFrac) / Math.max(0.04, (endFrac - startFrac) * 0.65)))
        : isAlreadySpoken
          ? 1
          : 0.28;

      const displayText =
        isCurrentlySpoken && pt.length > 24
          ? pt.slice(0, Math.max(18, Math.ceil(pt.length * localRevealFrac)))
          : pt;

      const wrapped = wrapTextLines(ctx, displayText, 645).slice(0, 3);
      const blockHeight = Math.max(28, wrapped.length * 26 + 8);

      ctx.save();
      if (isCurrentlySpoken) {
        ctx.fillStyle = 'rgba(34, 211, 238, 0.13)';
        ctx.strokeStyle = subjectInfo.accentHex;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(50, cursorY - 22, 692, blockHeight + 8, 10);
        ctx.fill();
        ctx.stroke();
      }

      ctx.globalAlpha = isCurrentlySpoken ? 1 : isAlreadySpoken ? 0.92 : 0.38;
      ctx.fillStyle = isCurrentlySpoken ? '#fbbf24' : subjectInfo.accentHex;
      ctx.beginPath();
      ctx.arc(68, cursorY - 6, isCurrentlySpoken ? 6.5 : 5.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = isCurrentlySpoken ? '#ffffff' : isAlreadySpoken ? '#e2e8f0' : '#94a3b8';
      ctx.font = isCurrentlySpoken ? '600 19px sans-serif' : '500 19px sans-serif';
      wrapped.forEach((ln, li) => {
        ctx.fillText(ln, 90, cursorY + li * 26);
      });
      cursorY += wrapped.length * 26 + 18;
      ctx.restore();
    });

    // Right Diagram Box
    drawSceneDiagram(ctx, activeScene, progress, subjectInfo.accentHex);

    // Captions Bar at bottom of canvas synchronized 1:1 with the spoken phrase
    if (captionsEnabled) {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.94)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(56, h - 94, w - 112, 68, 12);
      ctx.fill();
      ctx.stroke();

      const activeCaptionText =
        spokenChunkText || activeNarrationSegment?.text || activeScene.narration;
      ctx.fillStyle = '#38bdf8';
      ctx.font = '700 12px "JetBrains Mono", monospace';
      ctx.fillText('AI TEACHER VOICE · SYNCED', 78, h - 70);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '500 16px sans-serif';
      const capLines = wrapTextLines(ctx, activeCaptionText, w - 160);
      capLines.slice(0, 2).forEach((ln, ci) => {
        ctx.fillText(ln, 78, h - 46 + ci * 20);
      });
    }
  }, [
    activeScene,
    syncProgress,
    activeNarrationSegment,
    spokenChunkText,
    sceneIdx,
    scenes.length,
    subjectInfo,
    note.grade,
    captionsEnabled,
  ]);

  const totalDuration = scenes.reduce((acc, s) => acc + s.durationSeconds, 0);
  const elapsedBeforeScene = scenes
    .slice(0, sceneIdx)
    .reduce((acc, s) => acc + s.durationSeconds, 0);
  const globalElapsed = elapsedBeforeScene + sceneElapsed;

  const handleScrubGlobal = (val: number) => {
    let acc = 0;
    for (let i = 0; i < scenes.length; i++) {
      const dur = scenes[i].durationSeconds;
      if (val <= acc + dur || i === scenes.length - 1) {
        setSceneIdx(i);
        setSceneElapsed(Math.max(0, Math.min(dur, val - acc)));
        return;
      }
      acc += dur;
    }
  };

  const handleSaveBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = bookmarkText.trim();
    if (!clean) return;
    onAppendToNote(`\n\n> **Video Lesson Note (${activeScene.title}):** ${clean}`);
    setBookmarkText('');
    setBookmarkSavedMsg('Added to study note!');
    window.setTimeout(() => setBookmarkSavedMsg(null), 2500);
  };

  const showDimensionsSandbox =
    note.subject === 'physics' || note.id === 'note-phys-dimensions' || note.title.toLowerCase().includes('dimension');

  const showClickToPlayGate = !isPlaying && sceneIdx === 0 && sceneElapsed === 0 && stageMode !== 'drill';

  return (
    <div className="space-y-5" data-video-playing={isPlaying ? 'true' : 'false'}>
      {/* Stage Mode Selector + Math-Antics Big Idea Intuition Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Lesson stage view mode"
          className="inline-flex flex-wrap items-center p-1 rounded-xl bg-slate-950 border border-slate-800 gap-1 text-xs"
        >
          <button
            type="button"
            onClick={() => setStageMode('split')}
            aria-pressed={stageMode === 'split'}
            data-testid="video-mode-split"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
              stageMode === 'split'
                ? 'bg-cyan-500 text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <LayoutPanelLeft className="w-3.5 h-3.5" />
            <span>3D + Whiteboard</span>
          </button>
          <button
            type="button"
            onClick={() => setStageMode('3d')}
            aria-pressed={stageMode === '3d'}
            data-testid="video-mode-3d"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
              stageMode === '3d'
                ? 'bg-cyan-500 text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Model Only</span>
          </button>
          <button
            type="button"
            onClick={() => setStageMode('board')}
            aria-pressed={stageMode === 'board'}
            data-testid="video-mode-board"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              stageMode === 'board'
                ? 'bg-cyan-500 text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Whiteboard Only</span>
          </button>
          <button
            type="button"
            onClick={() => setStageMode('teacher-world')}
            aria-pressed={stageMode === 'teacher-world'}
            data-testid="video-mode-teacher-world"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              stageMode === 'teacher-world'
                ? 'bg-amber-400 text-slate-950'
                : 'text-amber-300 hover:text-amber-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Teacher&apos;s World</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setStageMode('drill');
            }}
            aria-pressed={stageMode === 'drill'}
            data-testid="video-mode-drill"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              stageMode === 'drill'
                ? 'bg-emerald-500 text-slate-950'
                : 'text-emerald-300 hover:text-emerald-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>
              Practice Drill
              {noteMastery && noteMastery.attemptsCount > 0 ? ` (${noteMastery.bestAccuracy}%)` : ''}
            </span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHumanTeacher((v) => !v)}
            aria-pressed={showHumanTeacher}
            data-testid="toggle-human-teacher-btn"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              showHumanTeacher
                ? 'bg-cyan-500/15 border-cyan-400/50 text-cyan-200'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Human AI Teacher</span>
          </button>

          <span className="text-[11px] font-mono text-slate-400">
            {isPlaying ? 'Playing continuous lesson & voice' : 'Paused — Click Play when ready'}
          </span>
        </div>
      </div>

      {/* Animated Human AI Teacher Presenter standing in front of board & simulation stage */}
      {showHumanTeacher && stageMode !== 'drill' && stageMode !== 'teacher-world' && activeScene && (
        <AIHumanTeacherPresenter
          personaId={activePersona}
          onChangePersona={handlePersonaChange}
          subject={note.subject}
          lessonTitle={activeScene.title}
          isPlaying={isPlaying}
          isSpeaking={voiceStatus === 'playing' || voiceStatus === 'fallback'}
          syncProgress={syncProgress}
          activeSpokenText={
            spokenChunkText || activeNarrationSegment?.text || activeScene.narration
          }
          recommendedSimKind={recommendedSimKind}
          activeSimOpen={activeEmbeddedSim !== null}
          onToggleSimulation={(kind) => {
            setActiveEmbeddedSim((prev) => {
              const next = prev ? null : kind;
              if (next) {
                onLogSimulationRun?.(next, note.subject);
              }
              return next;
            });
          }}
        />
      )}

      {/* Math-Antics Style Intuition Hook */}
      {activeScene?.intuitionHook && stageMode !== 'drill' && (
        <div className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-100">
          <Lightbulb className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300 mr-1.5">Big Idea Analogy:</span>
            <span>{activeScene.intuitionHook}</span>
          </div>
        </div>
      )}

      {/* Mandatory Formula Symbol-by-Symbol Explorer */}
      {activeScene?.formulaBreakdowns && activeScene.formulaBreakdowns.length > 0 && stageMode !== 'drill' && (
        <div
          data-testid="formula-breakdown-strip"
          className="rounded-xl border border-cyan-500/30 bg-[#0b1324]/95 p-3.5 space-y-2.5"
        >
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-bold text-cyan-300">
              Formulas Explained — Every Symbol &amp; Why It Works
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              Read aloud in lesson
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
            {activeScene.formulaBreakdowns.map((fb, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 space-y-1.5 text-xs"
              >
                <div className="font-mono font-bold text-white text-xs sm:text-sm">
                  {fb.formula}
                </div>
                <p className="text-slate-300 leading-snug">{fb.meaning}</p>
                <ul className="space-y-0.5 text-[11px] text-cyan-200/90 font-mono">
                  {fb.variables.map((v, vIdx) => (
                    <li key={vIdx}>• {v}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {stageMode === 'drill' ? (
        <NoteDrillPanel
          note={note}
          mastery={noteMastery}
          onCompleteDrill={onCompleteDrill}
          onAskTutor={onAskTutor}
        />
      ) : (
        <>
      {/* Interactive Whiteboard + 3D Illustration OR Teacher's World Stage */}
      <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl">
        {stageMode === 'teacher-world' && activeScene ? (
          <TeacherWorldStage
            scene={activeScene}
            sceneIdx={sceneIdx}
            totalScenes={scenes.length}
            noteTitle={note.title}
            subject={note.subject}
            grade={note.grade}
            personaId={activePersona}
            onChangePersona={handlePersonaChange}
            isPlaying={isPlaying}
            isSpeaking={voiceStatus === 'playing' || voiceStatus === 'fallback'}
            syncProgress={syncProgress}
            activeSpokenText={
              spokenChunkText || activeNarrationSegment?.text || activeScene.narration
            }
            showClickToPlayGate={showClickToPlayGate}
            onTogglePlay={() => setIsPlaying((p) => !p)}
            recommendedSimKind={recommendedSimKind}
            activeSimOpen={activeEmbeddedSim !== null}
            onToggleSimulation={(kind) => {
              setActiveEmbeddedSim((prev) => {
                const next = prev ? null : kind;
                if (next) {
                  onLogSimulationRun?.(next, note.subject);
                }
                return next;
              });
            }}
          />
        ) : (
        <div
          className={`relative w-full bg-[#070b14] grid gap-0 ${
            stageMode === 'split' ? 'grid-cols-1 xl:grid-cols-12' : 'grid-cols-1'
          }`}
        >
          {/* Animated Whiteboard Canvas */}
          {stageMode !== '3d' && (
            <div className={`relative aspect-video bg-[#070b14] ${stageMode === 'split' ? 'xl:col-span-7' : ''}`}>
              <canvas
                ref={canvasRef}
                width={1280}
                height={720}
                data-testid="note-video-canvas"
                className="w-full h-full block"
              />

              {/* Explicit Click-to-Play Overlay Gate (never auto-plays until user clicks Play) */}
              {showClickToPlayGate && (
                <div
                  data-testid="video-click-to-play-overlay"
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center p-5 text-center"
                  style={{ backgroundColor: 'rgba(7, 11, 20, 0.86)' }}
                >
                  <div className="max-w-md space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/15 border border-cyan-500/35 text-[11px] font-mono font-bold text-cyan-300">
                      <span>{subjectInfo.shortName} · {note.grade} · {scenes.length} Scenes + 3D Model</span>
                    </div>
                    <h4 className="font-display text-base sm:text-lg font-bold text-white leading-snug">
                      {note.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Explore the interactive 3D illustration alongside the step-by-step board, then press Play to start the AI Teacher walkthrough.
                    </p>
                    <button
                      type="button"
                      data-testid="video-gate-play-button"
                      onClick={() => setIsPlaying(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg transition-colors"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Click Play to Start Lesson</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Synchronized Interactive Three.js 3D Illustration */}
          {stageMode !== 'board' && activeScene && (
            <div
              className={`relative bg-[#070b14] ${
                stageMode === 'split'
                  ? 'xl:col-span-5 min-h-[260px] xl:min-h-0 border-t xl:border-t-0 xl:border-l border-slate-800'
                  : 'h-[380px] sm:h-[440px]'
              }`}
            >
              <Suspense
                fallback={
                  <div className="h-full min-h-[260px] flex items-center justify-center text-xs text-slate-400">
                    Loading 3D Interactive Stage...
                  </div>
                }
              >
                <VideoLesson3DStage
                  visual3DKind={activeScene.visual3DKind}
                  sceneTitle={activeScene.title}
                  accentHex={subjectInfo.accentHex}
                  isPlaying={isPlaying}
                  syncProgress={syncProgress}
                  sceneIdx={sceneIdx}
                />
              </Suspense>
              {stageMode === '3d' && showClickToPlayGate && (
                <button
                  type="button"
                  data-testid="video-gate-play-button"
                  onClick={() => setIsPlaying(true)}
                  className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg transition-colors"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play Lesson & Voice</span>
                </button>
              )}
            </div>
          )}
        </div>
        )}

        {/* Live 1:1 Audio-to-Writing Lockstep Strip */}
        {activeScene && (
          <div
            data-testid="video-sync-strip"
            className="px-4 py-2.5 border-t border-slate-800/80 bg-slate-950/95 flex flex-wrap items-center justify-between gap-2 text-xs"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/35 text-cyan-300 font-mono text-[10px] font-bold shrink-0">
                {activeNarrationSegment?.keyPointIndex !== null &&
                activeNarrationSegment?.keyPointIndex !== undefined
                  ? `BOARD POINT ${activeNarrationSegment.keyPointIndex + 1}`
                  : 'SCENE INTRO'}
              </span>
              <span className="text-slate-200 truncate">
                {spokenChunkText || activeNarrationSegment?.text || activeScene.title}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 shrink-0 tabular-nums">
              {Math.round(syncProgress * 100)}% synced
            </span>
          </div>
        )}

        {/* Transport & Timeline Controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 space-y-3">
          {/* Global Scrubber */}
          <div className="flex items-center gap-3 text-xs font-mono tabular-nums text-slate-400">
            <span>{Math.floor(globalElapsed)}s</span>
            <input
              type="range"
              aria-label="Lesson video timeline"
              min={0}
              max={totalDuration}
              step={0.2}
              value={globalElapsed}
              onChange={(e) => handleScrubGlobal(Number(e.target.value))}
              className="flex-1 accent-cyan-400"
            />
            <span>{Math.ceil(totalDuration)}s</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSceneIdx((i) => Math.max(0, i - 1));
                  setSceneElapsed(0);
                }}
                disabled={sceneIdx === 0}
                aria-label="Previous video chapter"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!isPlaying && sceneIdx === scenes.length - 1 && sceneElapsed >= activeScene.durationSeconds) {
                    setSceneIdx(0);
                    setSceneElapsed(0);
                  }
                  setIsPlaying((p) => !p);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause Lesson' : 'Play Lesson'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSceneIdx((i) => Math.min(scenes.length - 1, i + 1));
                  setSceneElapsed(0);
                }}
                disabled={sceneIdx === scenes.length - 1}
                aria-label="Next video chapter"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSceneIdx(0);
                  setSceneElapsed(0);
                  setIsPlaying(true);
                }}
                aria-label="Restart lesson"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() =>
                  setPlaybackRate((r) => (r === 1 ? 1.25 : r === 1.25 ? 1.5 : 1))
                }
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-mono text-slate-200"
              >
                {playbackRate}x
              </button>

              <button
                type="button"
                onClick={() => setVoiceEnabled((v) => !v)}
                aria-pressed={voiceEnabled}
                data-testid="video-voiceover-toggle"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
                  voiceEnabled
                    ? 'bg-cyan-500/15 border-cyan-400/50 text-cyan-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {voiceStatus === 'loading' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : voiceEnabled ? (
                  <Volume2 className="w-3.5 h-3.5" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}
                <span>
                  {voiceStatus === 'loading'
                    ? 'Generating Voice...'
                    : voiceStatus === 'playing'
                      ? 'AI Voice Playing'
                      : 'AI Teacher Voice'}
                </span>
              </button>

              {voiceEnabled && (
                <select
                  aria-label="Select AI Teacher voice"
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value as LiveVoiceName)}
                  className="px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                >
                  {LIVE_VOICE_OPTIONS.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label} ({v.tone})
                    </option>
                  ))}
                </select>
              )}

              {voiceStatus === 'blocked' && audioRef.current && (
                <button
                  type="button"
                  onClick={() => {
                    void audioRef.current?.play().then(() => setVoiceStatus('playing')).catch(() => {});
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-semibold"
                >
                  Tap to Play Voice
                </button>
              )}

              <button
                type="button"
                onClick={() => setCaptionsEnabled((v) => !v)}
                aria-pressed={captionsEnabled}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
                  captionsEnabled
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Captions className="w-3.5 h-3.5" />
                <span>Captions</span>
              </button>

              <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPauseAtCheckpoints}
                  onChange={(e) => setAutoPauseAtCheckpoints(e.target.checked)}
                  className="accent-cyan-400"
                />
                <span>Auto-pause quizzes</span>
              </label>

              {onLaunchAITeacher && (
                <button
                  type="button"
                  onClick={() =>
                    onLaunchAITeacher({
                      subject: note.subject,
                      grade: note.grade,
                      topicTitle: note.title,
                      topicSummary: note.content.slice(0, 1200),
                      sourceLabel: 'AI Video Lesson',
                      autoStart: true,
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 hover:bg-emerald-500/30 font-semibold transition-colors"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Interactive AI Teacher</span>
                </button>
              )}

              {onAskTutor && (
                <button
                  type="button"
                  onClick={() =>
                    onAskTutor(
                      `Walk me through "${activeScene.title}" from my ${note.grade} ${subjectInfo.name} study note "${note.title}". Key equations: ${activeScene.equations.join('; ') || 'none'}. Give me 1 worked WASSCE example.`
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/20 border border-violet-500/40 text-violet-200 hover:bg-violet-500/30 font-semibold transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI Tutor</span>
                </button>
              )}
            </div>
          </div>

          {/* Chapter Pills Strip */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
            {scenes.map((sc, i) => {
              const active = i === sceneIdx;
              const answered = completedCheckpoints[sc.id] !== undefined;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => {
                    setSceneIdx(i);
                    setSceneElapsed(0);
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-colors ${
                    active
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-75">{i + 1}.</span>
                  <span className="truncate max-w-[180px]">{sc.title}</span>
                  {answered && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Teacher Simulation Stage directly created from inside Video Lessons */}
      {activeEmbeddedSim && (
        <div
          data-testid="video-teacher-live-sim"
          className="rounded-2xl border border-emerald-500/40 bg-[#070b14] p-4 sm:p-5 space-y-4 shadow-xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-emerald-400" />
              <div>
                <h4 className="font-display text-sm font-bold text-white">
                  AI Teacher Live Simulation Workbench
                </h4>
                <p className="text-[11px] text-slate-400">
                  Manipulate live parameters while the AI Teacher walks through {activeScene?.title}.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                aria-label="Switch live teacher simulation"
                data-testid="video-live-sim-select"
                value={activeEmbeddedSim}
                onChange={(e) => {
                  const chosen = e.target.value as SimulatorKind;
                  setActiveEmbeddedSim(chosen);
                  onLogSimulationRun?.(chosen, note.subject);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-400"
              >
                {EMBEDDED_SIM_OPTIONS.map((opt) => (
                  <option key={opt.kind} value={opt.kind}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setActiveEmbeddedSim(null)}
                aria-label="Close live teacher simulation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <LabSimulatorHost kind={activeEmbeddedSim} />
        </div>
      )}
      </>
      )}

      {/* Interactive Checkpoint + Note Bookmark Row */}
      {stageMode !== 'drill' && (
        <>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Scene Interactive Knowledge Check */}
        <div className="rounded-2xl bg-slate-950/90 border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300">
              <HelpCircle className="w-4 h-4" />
              <span>Interactive Checkpoint · Scene {sceneIdx + 1}</span>
            </div>
            {activeScene.checkpoint && (
              <span className="text-[11px] text-slate-400">Tap an option to verify</span>
            )}
          </div>

          {activeScene.checkpoint ? (
            <div className="space-y-2.5">
              <div className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
                <MathText text={activeScene.checkpoint.prompt} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeScene.checkpoint.options.map((opt, optIdx) => {
                  const chosen = completedCheckpoints[activeScene.id];
                  const isAnswered = chosen !== undefined;
                  const isCorrect = optIdx === activeScene.checkpoint?.correctIndex;
                  const isSelected = chosen === optIdx;

                  let style = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600';
                  if (isAnswered) {
                    if (isCorrect) {
                      style = 'bg-emerald-500/15 border-emerald-400 text-emerald-200';
                    } else if (isSelected) {
                      style = 'bg-rose-500/15 border-rose-400 text-rose-200';
                    } else {
                      style = 'bg-slate-900/50 border-slate-800/60 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() =>
                        setCompletedCheckpoints((prev) => ({
                          ...prev,
                          [activeScene.id]: optIdx,
                        }))
                      }
                      className={`text-left p-2.5 rounded-xl border text-xs transition-colors ${style}`}
                    >
                      <span className="font-mono font-bold mr-1.5">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <MathText text={opt} />
                    </button>
                  );
                })}
              </div>

              {completedCheckpoints[activeScene.id] !== undefined && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed flex items-center justify-between gap-3">
                  <div>
                    <MathText text={activeScene.checkpoint.explanation} />
                  </div>
                  {sceneIdx < scenes.length - 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSceneIdx((i) => i + 1);
                        setSceneElapsed(0);
                        setIsPlaying(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold shrink-0"
                    >
                      Continue →
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-400 py-3">
              No quiz pause on this slide. Keep watching or jump to the next checkpoint chapter!
            </div>
          )}
        </div>

        {/* Timestamped Note Bookmarking */}
        <div className="rounded-2xl bg-slate-950/90 border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-300">
              <BookmarkPlus className="w-4 h-4" />
              <span>Save Timestamped Note from Lesson</span>
            </div>
            {bookmarkSavedMsg && (
              <span className="text-[11px] text-emerald-400 font-semibold">{bookmarkSavedMsg}</span>
            )}
          </div>

          <p className="text-xs text-slate-400">
            Capture an insight while watching <strong className="text-slate-200">{activeScene.title}</strong> and append it directly to your Markdown note.
          </p>

          <form onSubmit={handleSaveBookmark} className="flex gap-2">
            <input
              type="text"
              aria-label="Timestamped lesson note"
              value={bookmarkText}
              onChange={(e) => setBookmarkText(e.target.value)}
              placeholder={`Key takeaway for ${activeScene.title}...`}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors shrink-0"
            >
              Append
            </button>
          </form>
        </div>
      </div>

      {/* Interactive Dimensional Analysis Formula & Homogeneity Sandbox */}
      {showDimensionsSandbox && (
        <div
          data-testid="dimensional-sandbox"
          className="rounded-2xl bg-slate-950/90 border border-cyan-500/30 p-5 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-sm sm:text-base font-bold text-white">
                Interactive Dimensional Analysis Explorer <span className="font-mono text-cyan-300">[Mᵃ Lᵇ Tᶜ]</span>
              </h3>
              <p className="text-xs text-slate-400">
                <MathText text="Adjust exponents $a, b, c$ or select a physical quantity to inspect its dimensional formula and SI derivation." />
              </p>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-sm font-bold text-cyan-300 tabular-nums">
              [M^{expM} L^{expL} T^{expT}]
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {[
              { label: 'Mass exponent (a)', val: expM, set: setExpM, min: -2, max: 2, color: 'accent-cyan-400' },
              { label: 'Length exponent (b)', val: expL, set: setExpL, min: -3, max: 3, color: 'accent-emerald-400' },
              { label: 'Time exponent (c)', val: expT, set: setExpT, min: -3, max: 2, color: 'accent-amber-400' },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between font-mono tabular-nums">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="font-bold text-white">{item.val}</span>
                </div>
                <input
                  type="range"
                  aria-label={item.label}
                  min={item.min}
                  max={item.max}
                  step={1}
                  value={item.val}
                  onChange={(e) => item.set(Number(e.target.value))}
                  className={`w-full ${item.color}`}
                />
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            {matchedDim ? (
              <>
                <div>
                  <span className="text-emerald-400 font-bold">Matched Quantity: </span>
                  <span className="text-white font-semibold">{matchedDim.name}</span>
                  <span className="text-slate-400 ml-2">({matchedDim.formula})</span>
                </div>
                <div className="font-mono text-cyan-300 font-semibold">SI Unit: {matchedDim.unit}</div>
              </>
            ) : (
              <span className="text-slate-400">
                Custom dimensional combination <span className="font-mono text-slate-200">[M^{expM} L^{expL} T^{expT}]</span> — click a preset below to verify standard WASSCE quantities.
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {DIMENSION_REFERENCE_ITEMS.map((item) => {
              const active = matchedDim?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setExpM(item.m);
                    setExpL(item.l);
                    setExpT(item.t);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-colors ${
                    active
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};
