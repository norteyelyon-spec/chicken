import React, { useEffect, useRef, useState } from 'react';
import {
  computeEnzymeReactionRate,
  computeOsmosisAndPhotosynthesis,
  computePunnettGenetics,
  type GenotypePair,
} from '../../utils/labPhysics';

// 4. ENZYME KINETICS & DENATURATION SIMULATOR (Canvas)
export const EnzymeRateSimulator: React.FC = () => {
  const [tempC, setTempC] = useState(37);
  const [ph, setPh] = useState(7.0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const kinetics = computeEnzymeReactionRate(tempC, ph);

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

    const cx = 108;
    const cy = 140;
    ctx.fillStyle = kinetics.isDenatured ? '#ef4444' : '#84cc16';
    ctx.beginPath();
    if (kinetics.isDenatured) {
      ctx.ellipse(cx, cy, 58, 30, 0.35, 0, Math.PI * 2);
    } else {
      ctx.arc(cx, cy, 48, 0.35, Math.PI * 2 - 0.35);
      ctx.lineTo(cx + 8, cy);
      ctx.closePath();
    }
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(kinetics.isDenatured ? cx + 62 : cx + 32, cy, 13, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.fillText(
      kinetics.isDenatured ? 'Active Site Denatured' : 'Lock & Key Fit',
      32,
      235
    );

    const gx = 225;
    const gy = 32;
    const gw = w - gx - 28;
    const gh = h - 76;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(gx, gy, gw, gh);

    ctx.strokeStyle = '#84cc16';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let t = 5; t <= 70; t += 1) {
      const r = computeEnzymeReactionRate(t, ph).relativeRatePct;
      const px = gx + ((t - 5) / 65) * gw;
      const py = gy + gh - (r / 100) * gh;
      if (t === 5) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    const curX = gx + ((tempC - 5) / 65) * gw;
    const curY = gy + gh - (kinetics.relativeRatePct / 100) * gh;
    ctx.fillStyle = kinetics.isDenatured ? '#f43f5e' : '#fbbf24';
    ctx.beginPath();
    ctx.arc(curX, curY, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 11px "JetBrains Mono", monospace';
    ctx.fillText('100% Rate', gx - 4, gy - 8);
    ctx.fillText('5°C', gx, gy + gh + 18);
    ctx.fillText('37°C (Opt)', gx + ((37 - 5) / 65) * gw - 28, gy + gh + 18);
    ctx.fillText('70°C', gx + gw - 30, gy + gh + 18);
  }, [tempC, ph, kinetics.isDenatured, kinetics.relativeRatePct]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={640}
          height={290}
          data-testid="enzyme-rate-canvas"
          className="w-full h-auto block"
        />
      </div>

      <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 space-y-4 text-xs">
        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="enz-temp">Water Bath Temp</label>
            <span className="font-mono text-lime-300">{tempC}°C</span>
          </div>
          <input
            id="enz-temp"
            type="range"
            min={5}
            max={70}
            step={1}
            value={tempC}
            onChange={(e) => setTempC(Number(e.target.value))}
            className="w-full accent-lime-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="enz-ph">Buffer pH</label>
            <span className="font-mono text-cyan-300">pH {ph.toFixed(1)}</span>
          </div>
          <input
            id="enz-ph"
            type="range"
            min={2}
            max={12}
            step={0.5}
            value={ph}
            onChange={(e) => setPh(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
          <div className="flex justify-between font-mono tabular-nums">
            <span className="text-slate-400">Relative Catalysis Rate</span>
            <span className="text-white font-bold">{kinetics.relativeRatePct}%</span>
          </div>
          <div
            className={`text-[11px] font-medium ${
              kinetics.isDenatured ? 'text-rose-300' : 'text-lime-300'
            }`}
          >
            {kinetics.statusLabel}
          </div>
        </div>
      </div>
    </div>
  );
};

// 9. BIOLOGY OSMOSIS & PHOTOSYNTHESIS LIMITING FACTORS SIMULATOR (Canvas)
export const OsmosisCellSimulator: React.FC = () => {
  const [solutePct, setSolutePct] = useState(0.5);
  const [lightIntensity, setLightIntensity] = useState(75);
  const [co2Pct, setCo2Pct] = useState(0.08);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const bio = computeOsmosisAndPhotosynthesis(solutePct, lightIntensity, co2Pct);

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

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.strokeRect(24, 44, 240, 200);
    ctx.fillStyle = 'rgba(14, 165, 233, 0.08)';
    ctx.fillRect(24, 44, 240, 200);

    ctx.strokeStyle = '#84cc16';
    ctx.lineWidth = 4;
    ctx.strokeRect(74, 78, 140, 128);

    const shrink = bio.cellState.startsWith('Plasmolysed')
      ? 24
      : bio.cellState.startsWith('Flaccid')
        ? 10
        : 3;
    ctx.fillStyle = 'rgba(132, 204, 22, 0.25)';
    ctx.strokeStyle = '#bef264';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(74 + shrink, 78 + shrink, 140 - shrink * 2, 128 - shrink * 2, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(56, 189, 248, 0.32)';
    ctx.beginPath();
    ctx.ellipse(144, 142, Math.max(18, 46 - shrink * 1.1), Math.max(14, 38 - shrink * 0.9), 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(298, 44, 314, 200);

    const rayAlpha = Math.max(0.12, lightIntensity / 100);
    ctx.strokeStyle = `rgba(251, 191, 36, ${rayAlpha})`;
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(328, 70 + i * 24);
      ctx.lineTo(425, 118 + i * 16);
      ctx.stroke();
    }
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(325, 102, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.ellipse(445, 155, 28, 48, 0.2, 0, Math.PI * 2);
    ctx.fill();

    const bubbleCount = Math.max(1, Math.round(bio.photosynthesisRatePct / 12));
    ctx.fillStyle = '#67e8f9';
    for (let i = 0; i < bubbleCount; i++) {
      const bx = 442 + (i % 3) * 11;
      const by = 110 - ((i * 14) % 52);
      ctx.beginPath();
      ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '500 11px "JetBrains Mono", monospace';
    ctx.fillText(`Plant Cell: ${bio.cellState}`, 24, 24);
    ctx.fillText(`Rate: ${bio.photosynthesisRatePct}% O₂ | Limit: ${bio.limitingFactor}`, 298, 24);
  }, [bio.cellState, bio.photosynthesisRatePct, bio.limitingFactor, lightIntensity]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={640}
          height={290}
          data-testid="osmosis-cell-canvas"
          className="w-full h-auto block"
        />
      </div>

      <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 space-y-3.5 text-xs">
        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="bio-solute">External Sucrose Bath</label>
            <span className="font-mono text-lime-300">{solutePct.toFixed(1)}% (Sap = 2.0%)</span>
          </div>
          <input
            id="bio-solute"
            type="range"
            min={0}
            max={6.0}
            step={0.5}
            value={solutePct}
            onChange={(e) => setSolutePct(Number(e.target.value))}
            className="w-full accent-lime-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="bio-light">Light Intensity</label>
            <span className="font-mono text-amber-300">{lightIntensity}%</span>
          </div>
          <input
            id="bio-light"
            type="range"
            min={5}
            max={100}
            step={5}
            value={lightIntensity}
            onChange={(e) => setLightIntensity(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="bio-co2">Dissolved CO₂</label>
            <span className="font-mono text-cyan-300">{co2Pct.toFixed(2)}%</span>
          </div>
          <input
            id="bio-co2"
            type="range"
            min={0.01}
            max={0.14}
            step={0.01}
            value={co2Pct}
            onChange={(e) => setCo2Pct(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>

        <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 font-mono tabular-nums">
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Cell State</div>
            <div className="text-lime-300 font-bold text-[11px]">{bio.cellState}</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Limiting Factor</div>
            <div className="text-cyan-300 font-bold text-[11px]">{bio.limitingFactor}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 16. GRADE 12 (SHS 3) MENDELIAN PUNNETT GENETICS SIMULATOR
export const GeneticsPunnettSimulator: React.FC = () => {
  const [parent1, setParent1] = useState<GenotypePair>('Aa');
  const [parent2, setParent2] = useState<GenotypePair>('Aa');
  const res = computePunnettGenetics(parent1, parent2);
  const genotypes: GenotypePair[] = ['AA', 'Aa', 'aa'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5" data-testid="genetics-punnett-sim">
      <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-950 p-6 flex flex-col justify-center items-center gap-5">
        <div className="text-xs font-mono text-lime-300 font-semibold">
          2 × 2 Mendelian Monohybrid Punnett Square ({parent1} × {parent2})
        </div>
        <div className="grid grid-cols-3 gap-2 w-full max-w-md text-center font-mono">
          <div className="p-2 text-xs text-slate-500 flex items-center justify-center">Gametes</div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-bold">
            {parent2[0]}
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-bold">
            {parent2[1]}
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-bold flex items-center justify-center">
            {parent1[0]}
          </div>
          <div className={`p-4 rounded-xl border font-bold text-lg ${res.grid[0] === 'aa' ? 'bg-rose-500/15 border-rose-500/40 text-rose-200' : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'}`}>
            {res.grid[0]}
          </div>
          <div className={`p-4 rounded-xl border font-bold text-lg ${res.grid[1] === 'aa' ? 'bg-rose-500/15 border-rose-500/40 text-rose-200' : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'}`}>
            {res.grid[1]}
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-bold flex items-center justify-center">
            {parent1[1]}
          </div>
          <div className={`p-4 rounded-xl border font-bold text-lg ${res.grid[2] === 'aa' ? 'bg-rose-500/15 border-rose-500/40 text-rose-200' : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'}`}>
            {res.grid[2]}
          </div>
          <div className={`p-4 rounded-xl border font-bold text-lg ${res.grid[3] === 'aa' ? 'bg-rose-500/15 border-rose-500/40 text-rose-200' : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'}`}>
            {res.grid[3]}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 space-y-4 text-xs">
        <div className="space-y-1.5">
          <div className="text-slate-300 font-semibold">Parent 1 Genotype (P₁)</div>
          <div className="grid grid-cols-3 gap-1.5">
            {genotypes.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setParent1(g)}
                className={`py-2 rounded-lg font-mono font-bold border transition-colors ${
                  parent1 === g
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="text-slate-300 font-semibold">Parent 2 Genotype (P₂)</div>
          <div className="grid grid-cols-3 gap-1.5">
            {genotypes.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setParent2(g)}
                className={`py-2 rounded-lg font-mono font-bold border transition-colors ${
                  parent2 === g
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 font-mono tabular-nums">
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Dominant (A_)</div>
            <div className="text-emerald-300 font-bold">{res.dominantPhenotypePct}%</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Recessive (aa)</div>
            <div className="text-rose-300 font-bold">{res.recessivePhenotypePct}%</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900 col-span-2">
            <div className="text-[10px] text-slate-400">Genotype Ratio</div>
            <div className="text-white font-bold">{res.genotypeRatioText}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
