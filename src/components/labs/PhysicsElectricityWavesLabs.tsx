import React, { useEffect, useRef, useState } from 'react';
import {
  computeAcTransformerMetrics,
  computeElectrostaticsCoulomb,
  computeStandingWaveHarmonic,
  solveOhmsLawCircuit,
} from '../../utils/labPhysics';

// 1. OHM'S LAW CIRCUIT SIMULATOR (HTML5 Canvas)
export const OhmsLawSimulator: React.FC = () => {
  const [emf, setEmf] = useState(12);
  const [r1, setR1] = useState(4);
  const [r2, setR2] = useState(2);
  const [mode, setMode] = useState<'series' | 'parallel'>('series');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({ emf, r1, r2, mode });

  useEffect(() => {
    stateRef.current = { emf, r1, r2, mode };
  }, [emf, r1, r2, mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let phase = 0;

    const render = () => {
      const { emf: v, r1: a, r2: b, mode: m } = stateRef.current;
      const res = solveOhmsLawCircuit(v, a, b, m);
      const speed = Math.min(0.06, 0.004 + res.currentAmps * 0.006);
      phase = (phase + speed) % 1;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.07)';
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

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      if (m === 'series') {
        ctx.strokeRect(80, 55, w - 160, h - 110);
      } else {
        ctx.strokeRect(80, 45, w - 160, h - 90);
        ctx.beginPath();
        ctx.moveTo(210, 45);
        ctx.lineTo(210, 115);
        ctx.lineTo(w - 110, 115);
        ctx.lineTo(w - 110, 45);
        ctx.stroke();
      }

      const topY = m === 'series' ? 55 : 45;
      const botY = m === 'series' ? h - 55 : h - 45;
      const leftX = 80;
      const rightX = w - 80;
      const perimeter = 2 * (rightX - leftX) + 2 * (botY - topY);

      ctx.fillStyle = '#67e8f9';
      for (let i = 0; i < 14; i++) {
        const dist = ((phase + i / 14) % 1) * perimeter;
        let px = leftX;
        let py = topY;
        const topLen = rightX - leftX;
        const sideLen = botY - topY;
        if (dist < topLen) {
          px = leftX + dist;
          py = topY;
        } else if (dist < topLen + sideLen) {
          px = rightX;
          py = topY + (dist - topLen);
        } else if (dist < 2 * topLen + sideLen) {
          px = rightX - (dist - topLen - sideLen);
          py = botY;
        } else {
          px = leftX;
          py = botY - (dist - 2 * topLen - sideLen);
        }
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#090d16';
      ctx.fillRect(62, h / 2 - 22, 36, 44);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(64, h / 2 - 10);
      ctx.lineTo(96, h / 2 - 10);
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(72, h / 2 + 10);
      ctx.lineTo(88, h / 2 + 10);
      ctx.stroke();

      ctx.fillStyle = '#fde68a';
      ctx.font = '600 12px "JetBrains Mono", monospace';
      ctx.fillText(`${v}V`, 24, h / 2 + 4);

      const drawResistor = (cx: number, cy: number, label: string) => {
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 2;
        ctx.fillRect(cx - 42, cy - 14, 84, 28);
        ctx.strokeRect(cx - 42, cy - 14, 84, 28);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '600 12px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(label, cx, cy + 4);
        ctx.textAlign = 'start';
      };

      if (m === 'series') {
        drawResistor(w * 0.38, 55, `R1 = ${a}Ω`);
        drawResistor(w * 0.68, 55, `R2 = ${b}Ω`);
      } else {
        drawResistor(w * 0.54, 45, `R1 = ${a}Ω`);
        drawResistor(w * 0.54, 115, `R2 = ${b}Ω`);
      }

      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(w / 2, m === 'series' ? h - 55 : h - 45, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#6ee7b7';
      ctx.font = '700 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${res.currentAmps.toFixed(2)}A`, w / 2, (m === 'series' ? h - 55 : h - 45) + 4);
      ctx.textAlign = 'start';

      rafId = window.requestAnimationFrame(render);
    };

    rafId = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const result = solveOhmsLawCircuit(emf, r1, r2, mode);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={640}
          height={290}
          data-testid="ohms-law-canvas"
          className="w-full h-auto block"
        />
      </div>

      <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMode('series')}
            aria-pressed={mode === 'series'}
            className={`py-2 rounded-lg text-xs font-semibold border transition-colors ${
              mode === 'series'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            Series Mode
          </button>
          <button
            type="button"
            onClick={() => setMode('parallel')}
            aria-pressed={mode === 'parallel'}
            className={`py-2 rounded-lg text-xs font-semibold border transition-colors ${
              mode === 'parallel'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            Parallel Mode
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
              <label htmlFor="ohm-emf">Battery EMF (V)</label>
              <span className="font-mono text-amber-300">{emf.toFixed(1)} V</span>
            </div>
            <input
              id="ohm-emf"
              type="range"
              min={2}
              max={24}
              step={1}
              value={emf}
              onChange={(e) => setEmf(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
              <label htmlFor="ohm-r1">Resistor R₁</label>
              <span className="font-mono text-cyan-300">{r1.toFixed(1)} Ω</span>
            </div>
            <input
              id="ohm-r1"
              type="range"
              min={1}
              max={20}
              step={0.5}
              value={r1}
              onChange={(e) => setR1(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
              <label htmlFor="ohm-r2">Resistor R₂</label>
              <span className="font-mono text-cyan-300">{r2.toFixed(1)} Ω</span>
            </div>
            <input
              id="ohm-r2"
              type="range"
              min={1}
              max={20}
              step={0.5}
              value={r2}
              onChange={(e) => setR2(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono tabular-nums">
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">R_eq</div>
            <div className="text-white font-bold">{result.totalResistance.toFixed(2)} Ω</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Current (I)</div>
            <div className="text-emerald-300 font-bold">{result.currentAmps.toFixed(2)} A</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">V1 / V2</div>
            <div className="text-cyan-300 font-bold">
              {result.voltageR1.toFixed(1)}V / {result.voltageR2.toFixed(1)}V
            </div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Power (P)</div>
            <div className="text-amber-300 font-bold">{result.powerWatts.toFixed(1)} W</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. STANDING WAVES ON A VIBRATING STRING SIMULATOR (Canvas)
export const StandingWaveSimulator: React.FC = () => {
  const [harmonic, setHarmonic] = useState(2);
  const [tension, setTension] = useState(64);
  const [lengthM, setLengthM] = useState(1.2);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({ harmonic, tension, lengthM });

  useEffect(() => {
    stateRef.current = { harmonic, tension, lengthM };
  }, [harmonic, tension, lengthM]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let phase = 0;

    const render = () => {
      const { harmonic: n, tension: tVal, lengthM: len } = stateRef.current;
      const metrics = computeStandingWaveHarmonic(len, tVal, n);
      phase += 0.08 + metrics.frequencyHz * 0.0007;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);

      const leftX = 48;
      const rightX = w - 48;
      const spanW = rightX - leftX;
      const midY = h / 2;
      const amp = 68;

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.setLineDash([4, 4]);
      for (const sign of [-1, 1]) {
        ctx.beginPath();
        for (let i = 0; i <= 120; i++) {
          const u = i / 120;
          const x = leftX + u * spanW;
          const y = midY + sign * amp * Math.sin(n * Math.PI * u);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.setLineDash([]);

      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      for (let i = 0; i <= 140; i++) {
        const u = i / 140;
        const x = leftX + u * spanW;
        const y = midY + amp * Math.sin(n * Math.PI * u) * Math.cos(phase);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      for (let k = 0; k <= n; k++) {
        const nx = leftX + (k / n) * spanW;
        ctx.beginPath();
        ctx.arc(nx, midY, 5.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 11px "JetBrains Mono", monospace';
      ctx.fillText(
        `n = ${n}  |  Nodes = ${metrics.nodesCount}  |  Antinodes = ${metrics.antinodesCount}`,
        18,
        24
      );
      ctx.fillText(`f = ${metrics.frequencyHz} Hz  |  λ = ${metrics.wavelengthM} m`, 18, h - 18);

      rafId = window.requestAnimationFrame(render);
    };

    rafId = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const metrics = computeStandingWaveHarmonic(lengthM, tension, harmonic);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={640}
          height={290}
          data-testid="wave-standing-canvas"
          className="w-full h-auto block"
        />
      </div>

      <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 space-y-4 text-xs">
        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="wave-harmonic">Harmonic Number (n)</label>
            <span className="font-mono text-cyan-300">n = {harmonic}</span>
          </div>
          <input
            id="wave-harmonic"
            type="range"
            min={1}
            max={6}
            step={1}
            value={harmonic}
            onChange={(e) => setHarmonic(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="wave-tension">String Tension (T)</label>
            <span className="font-mono text-amber-300">{tension} N</span>
          </div>
          <input
            id="wave-tension"
            type="range"
            min={10}
            max={160}
            step={2}
            value={tension}
            onChange={(e) => setTension(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="wave-len">String Length (L)</label>
            <span className="font-mono text-emerald-300">{lengthM.toFixed(2)} m</span>
          </div>
          <input
            id="wave-len"
            type="range"
            min={0.5}
            max={2.0}
            step={0.1}
            value={lengthM}
            onChange={(e) => setLengthM(Number(e.target.value))}
            className="w-full accent-emerald-400"
          />
        </div>

        <div className="pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 font-mono tabular-nums">
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Speed v</div>
            <div className="text-cyan-300 font-bold">{metrics.waveSpeedMs} m/s</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Freq f</div>
            <div className="text-amber-300 font-bold">{metrics.frequencyHz} Hz</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">λ</div>
            <div className="text-emerald-300 font-bold">{metrics.wavelengthM} m</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 14. GRADE 11 (SHS 2) ELECTROSTATICS COULOMB FORCE & FIELD SIMULATOR
export const ElectrostaticsFieldSimulator: React.FC = () => {
  const [q1, setQ1] = useState(4);
  const [q2, setQ2] = useState(-3);
  const [distCm, setDistCm] = useState(12);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const res = computeElectrostaticsCoulomb(q1, q2, distCm);

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

    const midY = h / 2;
    const sepPx = 90 + (distCm / 30) * 280;
    const x1 = w / 2 - sepPx / 2;
    const x2 = w / 2 + sepPx / 2;

    const arrowDir = res.interactionType === 'Attraction' ? 1 : -1;
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, midY);
    ctx.lineTo(x1 + arrowDir * 44, midY);
    ctx.moveTo(x2, midY);
    ctx.lineTo(x2 - arrowDir * 44, midY);
    ctx.stroke();

    const drawCharge = (x: number, q: number, label: string) => {
      ctx.fillStyle = q >= 0 ? '#f43f5e' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(x, midY, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, midY + 4);
      ctx.textAlign = 'start';
    };

    drawCharge(x1, q1, `${q1 > 0 ? '+' : ''}${q1}μC`);
    drawCharge(x2, q2, `${q2 > 0 ? '+' : ''}${q2}μC`);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.fillText(`Coulomb Force F = ${res.forceNewtons} N (${res.interactionType})`, 22, 24);
  }, [q1, q2, distCm, res.forceNewtons, res.interactionType]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <canvas ref={canvasRef} width={640} height={290} data-testid="electrostatics-canvas" className="w-full h-auto block" />
      </div>
      <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 space-y-3.5 text-xs">
        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="elec-q1">Charge q₁</label>
            <span className="font-mono text-rose-300">{q1 > 0 ? '+' : ''}{q1} μC</span>
          </div>
          <input id="elec-q1" type="range" min={-8} max={8} step={1} value={q1} onChange={(e) => setQ1(Number(e.target.value) || 1)} className="w-full accent-rose-400" />
        </div>
        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="elec-q2">Charge q₂</label>
            <span className="font-mono text-cyan-300">{q2 > 0 ? '+' : ''}{q2} μC</span>
          </div>
          <input id="elec-q2" type="range" min={-8} max={8} step={1} value={q2} onChange={(e) => setQ2(Number(e.target.value) || -1)} className="w-full accent-cyan-400" />
        </div>
        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="elec-r">Separation (r)</label>
            <span className="font-mono text-amber-300">{distCm} cm</span>
          </div>
          <input id="elec-r" type="range" min={4} max={30} step={1} value={distCm} onChange={(e) => setDistCm(Number(e.target.value))} className="w-full accent-amber-400" />
        </div>
        <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 font-mono tabular-nums">
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Force |F|</div>
            <div className="text-amber-300 font-bold">{res.forceNewtons} N</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Mode</div>
            <div className="text-cyan-300 font-bold">{res.interactionType}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 15. GRADE 12 (SHS 3) AC TRANSFORMER & STEP-UP / STEP-DOWN SIMULATOR
export const AcTransformerSimulator: React.FC = () => {
  const [vp, setVp] = useState(240);
  const [np, setNp] = useState(400);
  const [ns, setNs] = useState(100);
  const [rLoad, setRLoad] = useState(30);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const res = computeAcTransformerMetrics(vp, np, ns, rLoad);

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

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 22;
    ctx.strokeRect(175, 68, 290, 154);

    const pCount = Math.max(4, Math.min(12, Math.round(np / 80)));
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    for (let i = 0; i < pCount; i++) {
      const y = 85 + (i / Math.max(1, pCount - 1)) * 120;
      ctx.beginPath();
      ctx.moveTo(154, y);
      ctx.lineTo(196, y + 6);
      ctx.stroke();
    }

    const sCount = Math.max(4, Math.min(14, Math.round(ns / 80)));
    ctx.strokeStyle = '#22d3ee';
    for (let i = 0; i < sCount; i++) {
      const y = 85 + (i / Math.max(1, sCount - 1)) * 120;
      ctx.beginPath();
      ctx.moveTo(444, y);
      ctx.lineTo(486, y + 6);
      ctx.stroke();
    }

    ctx.fillStyle = '#fde68a';
    ctx.font = '700 12px "JetBrains Mono", monospace';
    ctx.fillText(`Primary: ${vp}V AC`, 28, 128);
    ctx.fillText(`Np = ${np} turns`, 28, 148);
    ctx.fillText(`Ip = ${res.primaryCurrentA} A`, 28, 168);

    ctx.fillStyle = '#67e8f9';
    ctx.fillText(`Secondary: ${res.secondaryVoltageV}V`, 504, 128);
    ctx.fillText(`Ns = ${ns} turns`, 504, 148);
    ctx.fillText(`Is = ${res.secondaryCurrentA} A`, 504, 168);

    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`${res.transformerMode} Transformer · Ratio Ns/Np = ${res.turnsRatio}`, 175, 32);
  }, [vp, np, ns, res.primaryCurrentA, res.secondaryCurrentA, res.secondaryVoltageV, res.transformerMode, res.turnsRatio]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <canvas ref={canvasRef} width={640} height={290} data-testid="transformer-canvas" className="w-full h-auto block" />
      </div>
      <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 space-y-3 text-xs">
        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="tx-vp">Primary AC Voltage (Vp)</label>
            <span className="font-mono text-amber-300">{vp} V</span>
          </div>
          <input id="tx-vp" type="range" min={12} max={240} step={12} value={vp} onChange={(e) => setVp(Number(e.target.value))} className="w-full accent-amber-400" />
        </div>
        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="tx-np">Primary Turns (Np)</label>
            <span className="font-mono text-cyan-300">{np}</span>
          </div>
          <input id="tx-np" type="range" min={100} max={800} step={50} value={np} onChange={(e) => setNp(Number(e.target.value))} className="w-full accent-cyan-400" />
        </div>
        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="tx-ns">Secondary Turns (Ns)</label>
            <span className="font-mono text-emerald-300">{ns}</span>
          </div>
          <input id="tx-ns" type="range" min={100} max={1000} step={50} value={ns} onChange={(e) => setNs(Number(e.target.value))} className="w-full accent-emerald-400" />
        </div>
        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="tx-rload">Secondary Load (R)</label>
            <span className="font-mono text-slate-200">{rLoad} Ω</span>
          </div>
          <input id="tx-rload" type="range" min={10} max={120} step={5} value={rLoad} onChange={(e) => setRLoad(Number(e.target.value))} className="w-full accent-cyan-400" />
        </div>
        <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 font-mono tabular-nums">
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Output Vs</div>
            <div className="text-cyan-300 font-bold">{res.secondaryVoltageV} V</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Mode</div>
            <div className="text-emerald-300 font-bold">{res.transformerMode}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
