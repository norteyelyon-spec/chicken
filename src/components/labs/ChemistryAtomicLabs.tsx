import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import {
  computeCathodeRayDeflection,
  computeRadioactiveDecay,
  computeRutherfordScattering,
  type CathodeGasId,
  type FoilElement,
  type ScatteringModelMode,
} from '../../utils/labPhysics';

// 5. J.J. THOMSON CATHODE RAY TUBE (CRT) SIMULATOR (Canvas)
export const ThomsonCRTSimulator: React.FC = () => {
  const [plateVoltage, setPlateVoltage] = useState(250);
  const [magneticFieldMt, setMagneticFieldMt] = useState(0);
  const [acceleratingV, setAcceleratingV] = useState(2500);
  const [gasId, setGasId] = useState<CathodeGasId>('Ne');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({ plateVoltage, magneticFieldMt, acceleratingV, gasId });

  useEffect(() => {
    stateRef.current = { plateVoltage, magneticFieldMt, acceleratingV, gasId };
  }, [plateVoltage, magneticFieldMt, acceleratingV, gasId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let tick = 0;

    const render = () => {
      tick += 0.06;
      const { plateVoltage: vp, magneticFieldMt: bmT, acceleratingV: vAcc, gasId: g } = stateRef.current;
      const res = computeCathodeRayDeflection(vp, bmT, vAcc, g);

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.06)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 28) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 28) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const midY = h / 2;
      const tubeColor = g === 'H2' ? 'rgba(167, 139, 250, 0.14)' : g === 'Ne' ? 'rgba(56, 189, 248, 0.14)' : 'rgba(52, 211, 153, 0.14)';

      ctx.fillStyle = tubeColor;
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(36, midY - 38);
      ctx.lineTo(205, midY - 38);
      ctx.lineTo(548, midY - 94);
      ctx.lineTo(575, midY - 94);
      ctx.lineTo(575, midY + 94);
      ctx.lineTo(548, midY + 94);
      ctx.lineTo(205, midY + 38);
      ctx.lineTo(36, midY + 38);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(52, midY - 14, 10, 28);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(118, midY - 32, 8, 25);
      ctx.fillRect(118, midY + 7, 8, 25);
      ctx.fillRect(160, midY - 32, 8, 25);
      ctx.fillRect(160, midY + 7, 8, 25);

      const plateX1 = 225;
      const plateX2 = 345;
      ctx.fillStyle = vp >= 0 ? '#ef4444' : '#38bdf8';
      ctx.fillRect(plateX1, midY - 36, plateX2 - plateX1, 6);
      ctx.fillStyle = vp >= 0 ? '#38bdf8' : '#ef4444';
      ctx.fillRect(plateX1, midY + 30, plateX2 - plateX1, 6);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '600 10px "JetBrains Mono", monospace';
      ctx.fillText(vp >= 0 ? '+' : '−', plateX1 - 14, midY - 30);
      ctx.fillText(vp >= 0 ? '−' : '+', plateX1 - 14, midY + 36);

      ctx.strokeStyle = bmT > 0.05 ? 'rgba(16, 185, 129, 0.75)' : 'rgba(100, 116, 139, 0.35)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.arc((plateX1 + plateX2) / 2, midY, 54, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(62, midY);
      ctx.lineTo(568, midY);
      ctx.stroke();
      ctx.setLineDash([]);

      const screenX = 566;
      const pxDeflect = -(res.netDeflectionMm * 1.9);
      const hitY = Math.max(midY - 84, Math.min(midY + 84, midY + pxDeflect));

      ctx.strokeStyle = '#34d399';
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 10;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(62, midY);
      ctx.lineTo(plateX1, midY);
      ctx.quadraticCurveTo((plateX1 + plateX2) / 2, midY + pxDeflect * 0.14, plateX2, midY + pxDeflect * 0.34);
      ctx.lineTo(screenX, hitY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#a7f3d0';
      for (let i = 0; i < 6; i++) {
        const u = (tick * 0.25 + i / 6) % 1;
        const bx = 62 + u * (screenX - 62);
        let by = midY;
        if (bx > plateX1 && bx <= plateX2) {
          const p = (bx - plateX1) / (plateX2 - plateX1);
          by = midY + pxDeflect * 0.34 * p * p;
        } else if (bx > plateX2) {
          const p = (bx - plateX2) / (screenX - plateX2);
          by = midY + pxDeflect * (0.34 + 0.66 * p);
        }
        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = res.isVelocityBalanced ? '#22d3ee' : '#10b981';
      ctx.beginPath();
      ctx.arc(screenX, hitY, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 11px "JetBrains Mono", monospace';
      ctx.fillText(`Gas: ${g}  |  v = ${(res.electronSpeedMs / 1e7).toFixed(2)}×10⁷ m/s`, 20, 22);
      ctx.fillText(`e/m = ${res.eOverMRatio}`, 20, h - 16);
      ctx.fillText(`ZnS Spot: ${res.netDeflectionMm > 0 ? '+' : ''}${res.netDeflectionMm.toFixed(1)} mm`, screenX - 155, 22);

      rafId = window.requestAnimationFrame(render);
    };

    rafId = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const metrics = computeCathodeRayDeflection(plateVoltage, magneticFieldMt, acceleratingV, gasId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={640}
          height={290}
          data-testid="thomson-crt-canvas"
          className="w-full h-auto block"
        />
      </div>

      <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 space-y-3.5 text-xs">
        <div className="flex items-center gap-1.5">
          {(['H2', 'Ne', 'Ar'] as CathodeGasId[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGasId(g)}
              aria-pressed={gasId === g}
              className={`flex-1 py-1.5 rounded-lg font-mono font-bold border transition-colors ${
                gasId === g
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {g === 'H2' ? 'H₂ Gas' : g === 'Ne' ? 'Ne Gas' : 'Ar Gas'}
            </button>
          ))}
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="crt-plate-v">Plate Voltage (Vₚ)</label>
            <span className="font-mono text-cyan-300">{plateVoltage} V</span>
          </div>
          <input
            id="crt-plate-v"
            type="range"
            min={-400}
            max={400}
            step={10}
            value={plateVoltage}
            onChange={(e) => setPlateVoltage(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="crt-mag-b">Helmholtz B-Field</label>
            <span className="font-mono text-emerald-300">{magneticFieldMt.toFixed(2)} mT</span>
          </div>
          <input
            id="crt-mag-b"
            type="range"
            min={-2.5}
            max={2.5}
            step={0.05}
            value={magneticFieldMt}
            onChange={(e) => setMagneticFieldMt(Number(e.target.value))}
            className="w-full accent-emerald-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="crt-acc-v">Anode Voltage (Vₐ)</label>
            <span className="font-mono text-amber-300">{acceleratingV} V</span>
          </div>
          <input
            id="crt-acc-v"
            type="range"
            min={1000}
            max={5000}
            step={100}
            value={acceleratingV}
            onChange={(e) => setAcceleratingV(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMagneticFieldMt(Math.max(-2.5, Math.min(2.5, metrics.balanceMagneticFieldMt)))}
            className="flex-1 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 font-semibold transition-colors"
          >
            Balance E = vB
          </button>
          <button
            type="button"
            onClick={() => {
              setPlateVoltage(250);
              setMagneticFieldMt(0);
              setAcceleratingV(2500);
            }}
            aria-label="Reset CRT controls"
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 font-mono tabular-nums">
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Net Deflection</div>
            <div className="text-white font-bold">
              {metrics.netDeflectionMm > 0 ? '+' : ''}
              {metrics.netDeflectionMm} mm
            </div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Filter Status</div>
            <div className={metrics.isVelocityBalanced ? 'text-cyan-300 font-bold' : 'text-amber-300 font-bold'}>
              {metrics.isVelocityBalanced ? 'Balanced (v=E/B)' : 'Deflected'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 6. RUTHERFORD GOLD FOIL ALPHA SCATTERING SIMULATOR (Canvas)
export const RutherfordScatteringSimulator: React.FC = () => {
  const [alphaEnergy, setAlphaEnergy] = useState(5.0);
  const [foilElement, setFoilElement] = useState<FoilElement>('Au');
  const [modelMode, setModelMode] = useState<ScatteringModelMode>('rutherford');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({ alphaEnergy, foilElement, modelMode });

  useEffect(() => {
    stateRef.current = { alphaEnergy, foilElement, modelMode };
  }, [alphaEnergy, foilElement, modelMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    interface AlphaParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      scatterAngle: number;
      scattered: boolean;
    }

    const createParticle = (idx: number, mode: ScatteringModelMode, z: number, energy: number): AlphaParticle => {
      const laneOffsets = [-68, -46, -24, -8, 0, 10, 26, 48, 70];
      const yOffset = laneOffsets[idx % laneOffsets.length];
      let angle = 0;
      if (mode === 'rutherford') {
        const strength = (z / 79) * (5.0 / energy);
        const absY = Math.abs(yOffset);
        if (absY <= 2) {
          angle = (idx % 2 === 0 ? 1 : -1) * (2.4 + Math.min(0.6, 0.35 * strength));
        } else if (absY <= 12) {
          angle = (yOffset >= 0 ? 1 : -1) * Math.min(1.15, 0.48 * strength);
        } else {
          angle = (yOffset >= 0 ? 1 : -1) * 0.03 * strength;
        }
      }
      return {
        x: 92 - idx * 24,
        y: 145 + yOffset,
        vx: 3.1,
        vy: 0,
        scatterAngle: angle,
        scattered: false,
      };
    };

    const particles: AlphaParticle[] = Array.from({ length: 12 }, (_, idx) =>
      createParticle(idx, stateRef.current.modelMode, stateRef.current.foilElement === 'Au' ? 79 : 13, stateRef.current.alphaEnergy)
    );

    let rafId = 0;
    const render = () => {
      const { alphaEnergy: energy, foilElement: foil, modelMode: mode } = stateRef.current;
      const z = foil === 'Au' ? 79 : 13;
      const w = canvas.width;
      const h = canvas.height;
      const foilX = 330;
      const midY = h / 2;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(foilX, midY, 126, -Math.PI * 0.88, Math.PI * 0.88);
      ctx.stroke();

      ctx.fillStyle = '#334155';
      ctx.fillRect(22, midY - 34, 58, 68);
      ctx.fillStyle = '#090d16';
      ctx.fillRect(58, midY - 8, 24, 16);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(46, midY, 9, 0, Math.PI * 2);
      ctx.fill();

      const atomYPositions = [midY - 56, midY, midY + 56];
      if (mode === 'thomson') {
        for (const ay of atomYPositions) {
          ctx.fillStyle = 'rgba(244, 114, 182, 0.22)';
          ctx.strokeStyle = 'rgba(244, 114, 182, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(foilX, ay, 24, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      } else {
        ctx.strokeStyle = foil === 'Au' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1;
        for (const ay of atomYPositions) {
          ctx.beginPath();
          ctx.arc(foilX, ay, 24, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = foil === 'Au' ? '#fbbf24' : '#38bdf8';
          ctx.beginPath();
          ctx.arc(foilX, ay, foil === 'Au' ? 4.5 : 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.strokeStyle = foil === 'Au' ? 'rgba(251, 191, 36, 0.55)' : 'rgba(56, 189, 248, 0.55)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(foilX, midY - 90);
      ctx.lineTo(foilX, midY + 90);
      ctx.stroke();

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (!p.scattered && p.x >= foilX - 2) {
          p.scattered = true;
          const speed = 3.1;
          p.vx = speed * Math.cos(p.scatterAngle);
          p.vy = speed * Math.sin(p.scatterAngle);
        }

        const outOfBounds = p.x > w - 18 || p.x < 85 || p.y < 14 || p.y > h - 14;
        if (outOfBounds) {
          particles[idx] = createParticle(idx, mode, z, energy);
          particles[idx].x = 84;
          return;
        }

        const isBack = p.scattered && Math.abs(p.scatterAngle) > 1.5;
        ctx.fillStyle = isBack ? '#fb7185' : '#22d3ee';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 11px "JetBrains Mono", monospace';
      ctx.fillText(
        `${mode === 'rutherford' ? 'Rutherford Nuclear' : 'Thomson Plum Pudding'} · ${foil} (Z=${z}) · ${energy.toFixed(1)} MeV`,
        18,
        22
      );
      ctx.fillText('ZnS Scintillation Screen', foilX + 64, h - 16);

      rafId = window.requestAnimationFrame(render);
    };

    rafId = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const stats = computeRutherfordScattering(alphaEnergy, foilElement, modelMode);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={640}
          height={290}
          data-testid="rutherford-canvas"
          className="w-full h-auto block"
        />
      </div>

      <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 space-y-3.5 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setModelMode('rutherford')}
            aria-pressed={modelMode === 'rutherford'}
            className={`py-2 rounded-lg font-semibold border transition-colors ${
              modelMode === 'rutherford'
                ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Rutherford Nuclear
          </button>
          <button
            type="button"
            onClick={() => setModelMode('thomson')}
            aria-pressed={modelMode === 'thomson'}
            className={`py-2 rounded-lg font-semibold border transition-colors ${
              modelMode === 'thomson'
                ? 'bg-pink-500/20 border-pink-400 text-pink-200'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Thomson Pudding
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setFoilElement('Au')}
            aria-pressed={foilElement === 'Au'}
            className={`py-1.5 rounded-lg font-mono font-semibold border transition-colors ${
              foilElement === 'Au'
                ? 'bg-amber-500/15 border-amber-400/60 text-amber-200'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            Gold Au (Z=79)
          </button>
          <button
            type="button"
            onClick={() => setFoilElement('Al')}
            aria-pressed={foilElement === 'Al'}
            className={`py-1.5 rounded-lg font-mono font-semibold border transition-colors ${
              foilElement === 'Al'
                ? 'bg-cyan-500/15 border-cyan-400/60 text-cyan-200'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            Aluminium Al (Z=13)
          </button>
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="ruth-energy">Alpha Particle Energy</label>
            <span className="font-mono text-cyan-300">{alphaEnergy.toFixed(1)} MeV</span>
          </div>
          <input
            id="ruth-energy"
            type="range"
            min={2.0}
            max={10.0}
            step={0.5}
            value={alphaEnergy}
            onChange={(e) => setAlphaEnergy(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>

        <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 font-mono tabular-nums">
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Straight (&lt;2°)</div>
            <div className="text-cyan-300 font-bold">{stats.straightThroughPct}%</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Deflected (2°–90°)</div>
            <div className="text-amber-300 font-bold">{stats.smallDeflectionPct}%</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Backscatter (&gt;90°)</div>
            <div className="text-rose-300 font-bold">{stats.backscatterPct}%</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Closest d_min</div>
            <div className="text-emerald-300 font-bold">{stats.closestApproachFm} fm</div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">{stats.explanation}</p>
      </div>
    </div>
  );
};

// 8. NUCLEAR RADIOACTIVE HALF-LIFE & DECAY SIMULATOR (Canvas)
export const RadioactiveDecaySimulator: React.FC = () => {
  const [n0, setN0] = useState(400);
  const [halfLife, setHalfLife] = useState(2.0);
  const [elapsed, setElapsed] = useState(2.0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const stats = computeRadioactiveDecay(n0, halfLife, elapsed);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    const cols = 20;
    const startX = 24;
    const startY = 44;
    const spacing = 10.5;
    for (let i = 0; i < n0; i++) {
      const r = Math.floor(i / cols);
      const c = i % cols;
      const hash = ((i * 2654435761) >>> 0) / 4294967295;
      const alive = hash < stats.activityFractionPct / 100;
      ctx.fillStyle = alive ? '#22d3ee' : '#334155';
      ctx.beginPath();
      ctx.arc(startX + c * spacing, startY + r * spacing, 3.6, 0, Math.PI * 2);
      ctx.fill();
    }

    const gx = 275;
    const gy = 38;
    const gw = 335;
    const gh = 205;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx, gy + gh);
    ctx.lineTo(gx + gw, gy + gh);
    ctx.stroke();

    const maxT = halfLife * 5;
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const t = (i / 100) * maxT;
      const frac = Math.pow(0.5, t / halfLife);
      const px = gx + (t / maxT) * gw;
      const py = gy + gh - frac * gh;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    const curFrac = Math.pow(0.5, Math.min(elapsed, maxT) / halfLife);
    const curX = gx + (Math.min(elapsed, maxT) / maxT) * gw;
    const curY = gy + gh - curFrac * gh;
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(curX, curY, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '500 11px "JetBrains Mono", monospace';
    ctx.fillText(`Undecayed (Cyan): ${stats.remainingNuclei} | Decayed: ${stats.decayedNuclei}`, 20, 22);
    ctx.fillText(`N(t) = N₀(1/2)^(t / T½)`, gx, 22);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`0h`, gx, gy + gh + 18);
    ctx.fillText(`t½=${halfLife}h`, gx + gw * 0.2 - 18, gy + gh + 18);
    ctx.fillText(`${maxT.toFixed(1)}h`, gx + gw - 30, gy + gh + 18);
  }, [n0, halfLife, elapsed, stats.activityFractionPct, stats.remainingNuclei, stats.decayedNuclei]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={640}
          height={290}
          data-testid="radioactive-decay-canvas"
          className="w-full h-auto block"
        />
      </div>

      <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 space-y-3.5 text-xs">
        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="decay-n0">Initial Nuclei (N₀)</label>
            <span className="font-mono text-cyan-300">{n0}</span>
          </div>
          <input
            id="decay-n0"
            type="range"
            min={100}
            max={400}
            step={50}
            value={n0}
            onChange={(e) => setN0(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="decay-halflife">Half-Life (T½)</label>
            <span className="font-mono text-amber-300">{halfLife.toFixed(1)} hrs</span>
          </div>
          <input
            id="decay-halflife"
            type="range"
            min={1.0}
            max={6.0}
            step={0.5}
            value={halfLife}
            onChange={(e) => setHalfLife(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="decay-elapsed">Elapsed Time (t)</label>
            <span className="font-mono text-emerald-300">{elapsed.toFixed(1)} hrs</span>
          </div>
          <input
            id="decay-elapsed"
            type="range"
            min={0}
            max={20}
            step={0.5}
            value={elapsed}
            onChange={(e) => setElapsed(Number(e.target.value))}
            className="w-full accent-emerald-400"
          />
        </div>

        <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 font-mono tabular-nums">
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Remaining N(t)</div>
            <div className="text-cyan-300 font-bold">{stats.remainingNuclei}</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Activity %</div>
            <div className="text-amber-300 font-bold">{stats.activityFractionPct}%</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Half-Lives</div>
            <div className="text-white font-bold">{stats.halfLivesElapsed}</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">λ (ln2 / T½)</div>
            <div className="text-emerald-300 font-bold">{stats.decayConstantPerHr} h⁻¹</div>
          </div>
        </div>
      </div>
    </div>
  );
};
