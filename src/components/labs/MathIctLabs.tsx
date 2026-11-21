import React, { useEffect, useRef, useState } from 'react';
import {
  buildTruthTable,
  computeBearingVector,
  computeMathCalculusSample,
  evaluateLogicGate,
  type LogicGateType,
  type MathFunctionPreset,
} from '../../utils/labPhysics';

// 4. ICT LOGIC GATE SIMULATOR
export const LogicGateSimulator: React.FC = () => {
  const [gate, setGate] = useState<LogicGateType>('XOR');
  const [inputA, setInputA] = useState(true);
  const [inputB, setInputB] = useState(false);

  const output = evaluateLogicGate(gate, inputA, inputB);
  const table = buildTruthTable(gate);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-950 p-6 flex flex-col justify-between gap-6">
        <div className="flex flex-wrap gap-2">
          {(['AND', 'OR', 'NAND', 'NOR', 'XOR'] as LogicGateType[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGate(g)}
              aria-pressed={gate === g}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold border transition-colors ${
                gate === g
                  ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 py-4">
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setInputA((v) => !v)}
              className={`w-28 py-2.5 px-3 rounded-xl border font-mono text-xs font-bold transition-colors ${
                inputA
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              Input A = {inputA ? '1' : '0'}
            </button>
            <button
              type="button"
              onClick={() => setInputB((v) => !v)}
              className={`block w-28 py-2.5 px-3 rounded-xl border font-mono text-xs font-bold transition-colors ${
                inputB
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              Input B = {inputB ? '1' : '0'}
            </button>
          </div>

          <svg viewBox="0 0 240 120" className="w-56 h-28 shrink-0" aria-label={`${gate} logic gate schematic`}>
            <line
              x1="10"
              y1="35"
              x2="70"
              y2="35"
              stroke={inputA ? '#34d399' : '#475569'}
              strokeWidth="4"
            />
            <line
              x1="10"
              y1="85"
              x2="70"
              y2="85"
              stroke={inputB ? '#34d399' : '#475569'}
              strokeWidth="4"
            />
            <rect
              x="70"
              y="20"
              width="95"
              height="80"
              rx="14"
              fill="#0f172a"
              stroke="#3b82f6"
              strokeWidth="3"
            />
            <text
              x="117"
              y="65"
              textAnchor="middle"
              fill="#e2e8f0"
              fontSize="16"
              fontFamily="JetBrains Mono, monospace"
              fontWeight="700"
            >
              {gate}
            </text>
            <line
              x1="165"
              y1="60"
              x2="230"
              y2="60"
              stroke={output ? '#38bdf8' : '#475569'}
              strokeWidth="4"
            />
          </svg>

          <div
            className={`w-28 py-4 px-3 rounded-xl border text-center font-mono transition-colors ${
              output
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <div className="text-[10px] uppercase tracking-wider opacity-75">Output Q</div>
            <div className="text-xl font-bold mt-0.5">{output ? '1 (HIGH)' : '0 (LOW)'}</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4">
        <div className="text-xs font-semibold text-slate-300 mb-3">
          Live {gate} Truth Table
        </div>
        <table className="w-full text-xs font-mono tabular-nums">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-2 text-left">A</th>
              <th className="py-2 text-left">B</th>
              <th className="py-2 text-right">Q</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {table.map((row, idx) => {
              const active = (row.a === 1) === inputA && (row.b === 1) === inputB;
              return (
                <tr
                  key={idx}
                  className={active ? 'bg-blue-500/15 text-blue-200 font-bold' : 'text-slate-400'}
                >
                  <td className="py-2">{row.a}</td>
                  <td className="py-2">{row.b}</td>
                  <td className="py-2 text-right">{row.out}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 7. ELECTIVE / CORE MATHS CALCULUS TANGENT & INTEGRAL SIMULATOR (Canvas)
export const MathCalculusSimulator: React.FC = () => {
  const [fnType, setFnType] = useState<MathFunctionPreset>('quadratic');
  const [xVal, setXVal] = useState(3.0);
  const [aBound, setABound] = useState(0.5);
  const [bBound, setBBound] = useState(4.0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const sample = computeMathCalculusSample(fnType, xVal, aBound, bBound);

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

    const xMin = -3.5;
    const xMax = 5.5;
    const yMin = -3.5;
    const yMax = 4.5;
    const toPx = (x: number, y: number) => ({
      px: ((x - xMin) / (xMax - xMin)) * w,
      py: h - ((y - yMin) / (yMax - yMin)) * h,
    });

    const evalY = (x: number) =>
      fnType === 'quadratic'
        ? 0.5 * x * x - 2 * x + 1
        : fnType === 'cubic'
          ? 0.25 * x * x * x - x
          : 2 * Math.sin(x);

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
    ctx.lineWidth = 1;
    for (let gx = -3; gx <= 5; gx++) {
      const { px } = toPx(gx, 0);
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, h);
      ctx.stroke();
    }
    for (let gy = -3; gy <= 4; gy++) {
      const { py } = toPx(0, gy);
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(w, py);
      ctx.stroke();
    }

    const origin = toPx(0, 0);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, origin.py);
    ctx.lineTo(w, origin.py);
    ctx.moveTo(origin.px, 0);
    ctx.lineTo(origin.px, h);
    ctx.stroke();

    const low = Math.min(aBound, bBound);
    const high = Math.max(aBound, bBound);
    ctx.fillStyle = 'rgba(139, 92, 246, 0.22)';
    ctx.beginPath();
    const startBase = toPx(low, 0);
    ctx.moveTo(startBase.px, startBase.py);
    for (let i = 0; i <= 60; i++) {
      const x = low + (i / 60) * (high - low);
      const pt = toPx(x, evalY(x));
      ctx.lineTo(pt.px, pt.py);
    }
    const endBase = toPx(high, 0);
    ctx.lineTo(endBase.px, endBase.py);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i <= 180; i++) {
      const x = xMin + (i / 180) * (xMax - xMin);
      const pt = toPx(x, evalY(x));
      if (i === 0) ctx.moveTo(pt.px, pt.py);
      else ctx.lineTo(pt.px, pt.py);
    }
    ctx.stroke();

    const y0 = evalY(xVal);
    const slope = sample.derivative;
    const tLeft = toPx(xVal - 1.8, y0 - slope * 1.8);
    const tRight = toPx(xVal + 1.8, y0 + slope * 1.8);
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(tLeft.px, tLeft.py);
    ctx.lineTo(tRight.px, tRight.py);
    ctx.stroke();
    ctx.setLineDash([]);

    const activePt = toPx(xVal, y0);
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(activePt.px, activePt.py, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '500 11px "JetBrains Mono", monospace';
    const eqLabel =
      fnType === 'quadratic'
        ? 'f(x) = 0.5x² − 2x + 1'
        : fnType === 'cubic'
          ? 'f(x) = 0.25x³ − x'
          : 'f(x) = 2 sin(x)';
    ctx.fillText(eqLabel, 16, 22);
    ctx.fillStyle = '#22d3ee';
    ctx.fillText(`Tangent dy/dx = ${sample.derivative.toFixed(2)}`, 16, 40);
    ctx.fillStyle = '#c4b5fd';
    ctx.fillText(`∫[${low.toFixed(1)}, ${high.toFixed(1)}] = ${sample.riemannIntegral.toFixed(2)}`, 16, h - 16);
  }, [fnType, xVal, aBound, bBound, sample.derivative, sample.riemannIntegral]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={640}
          height={290}
          data-testid="math-calculus-canvas"
          className="w-full h-auto block"
        />
      </div>

      <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 space-y-3.5 text-xs">
        <div className="grid grid-cols-3 gap-1.5">
          {([
            ['quadratic', 'Quadratic'],
            ['cubic', 'Cubic'],
            ['sine', '2 sin(x)'],
          ] as [MathFunctionPreset, string][]).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFnType(id)}
              aria-pressed={fnType === id}
              className={`py-1.5 rounded-lg font-semibold border transition-colors ${
                fnType === id
                  ? 'bg-violet-500/20 border-violet-400 text-violet-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="calc-x-val">Tangent Probe (x)</label>
            <span className="font-mono text-amber-300">{xVal.toFixed(1)}</span>
          </div>
          <input
            id="calc-x-val"
            type="range"
            min={-2.5}
            max={4.5}
            step={0.1}
            value={xVal}
            onChange={(e) => setXVal(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="calc-a-bound">Lower Limit (a)</label>
            <span className="font-mono text-violet-300">{aBound.toFixed(1)}</span>
          </div>
          <input
            id="calc-a-bound"
            type="range"
            min={-2.5}
            max={3.5}
            step={0.5}
            value={aBound}
            onChange={(e) => setABound(Number(e.target.value))}
            className="w-full accent-violet-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="calc-b-bound">Upper Limit (b)</label>
            <span className="font-mono text-violet-300">{bBound.toFixed(1)}</span>
          </div>
          <input
            id="calc-b-bound"
            type="range"
            min={-1.5}
            max={4.5}
            step={0.5}
            value={bBound}
            onChange={(e) => setBBound(Number(e.target.value))}
            className="w-full accent-violet-400"
          />
        </div>

        <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-2 font-mono tabular-nums">
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">f(x)</div>
            <div className="text-white font-bold">{sample.fx.toFixed(2)}</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">dy/dx</div>
            <div className="text-cyan-300 font-bold">{sample.derivative.toFixed(2)}</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Area ∫dx</div>
            <div className="text-violet-300 font-bold">{sample.riemannIntegral.toFixed(2)}</div>
          </div>
        </div>
        <p className="text-[11px] text-slate-400">{sample.stationarySummary}</p>
      </div>
    </div>
  );
};

// 13. GRADE 11 (SHS 2) THREE-FIGURE BEARINGS & TRIG DISPLACEMENT SIMULATOR
export const BearingsTrigSimulator: React.FC = () => {
  const [bearingDeg, setBearingDeg] = useState(55);
  const [distanceKm, setDistanceKm] = useState(12);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const vec = computeBearingVector(bearingDeg, distanceKm);

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

    const cx = w / 2;
    const cy = h / 2 + 8;
    const rMax = 108;

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, rMax, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - rMax - 12);
    ctx.lineTo(cx, cy + rMax + 12);
    ctx.moveTo(cx - rMax - 12, cy);
    ctx.lineTo(cx + rMax + 12, cy);
    ctx.stroke();

    const rad = (bearingDeg * Math.PI) / 180;
    const lenPx = (distanceKm / 20) * rMax;
    const tx = cx + lenPx * Math.sin(rad);
    const ty = cy - lenPx * Math.cos(rad);

    ctx.strokeStyle = 'rgba(52, 211, 153, 0.7)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(tx, cy);
    ctx.lineTo(tx, ty);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(tx, ty);
    ctx.stroke();

    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.arc(tx, ty, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.fillText('N (000°)', cx - 26, cy - rMax - 18);
    ctx.fillText(`Bearing ${String(bearingDeg).padStart(3, '0')}° · ${vec.quadrantLabel}`, 20, 24);
  }, [bearingDeg, distanceKm, vec.quadrantLabel]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <canvas ref={canvasRef} width={640} height={290} data-testid="bearings-canvas" className="w-full h-auto block" />
      </div>
      <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 space-y-4 text-xs">
        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="bear-deg">Clockwise Bearing from North</label>
            <span className="font-mono text-amber-300">{String(bearingDeg).padStart(3, '0')}°</span>
          </div>
          <input id="bear-deg" type="range" min={0} max={355} step={5} value={bearingDeg} onChange={(e) => setBearingDeg(Number(e.target.value))} className="w-full accent-amber-400" />
        </div>
        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="bear-dist">Journey Distance (d)</label>
            <span className="font-mono text-cyan-300">{distanceKm} km</span>
          </div>
          <input id="bear-dist" type="range" min={2} max={20} step={1} value={distanceKm} onChange={(e) => setDistanceKm(Number(e.target.value))} className="w-full accent-cyan-400" />
        </div>
        <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 font-mono tabular-nums">
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">East (d sinθ)</div>
            <div className="text-emerald-300 font-bold">{vec.eastKm} km</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">North (d cosθ)</div>
            <div className="text-cyan-300 font-bold">{vec.northKm} km</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900 col-span-2">
            <div className="text-[10px] text-slate-400">Back Bearing</div>
            <div className="text-amber-300 font-bold">{String(vec.returnBearingDeg).padStart(3, '0')}°</div>
          </div>
        </div>
      </div>
    </div>
  );
};
