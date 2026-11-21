import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { computeIdealGasState, computeTitrationPH } from '../../utils/labPhysics';

// 2. IDEAL GAS LAW PISTON & KINETIC MOLECULAR SIMULATOR (Canvas)
export const GasLawsSimulator: React.FC = () => {
  const [volumeL, setVolumeL] = useState(8);
  const [tempK, setTempK] = useState(300);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({ volumeL, tempK });

  useEffect(() => {
    stateRef.current = { volumeL, tempK };
  }, [volumeL, tempK]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles = Array.from({ length: 28 }, (_, idx) => {
      const ang = (idx * 2.39996) % (Math.PI * 2);
      return {
        x: 60 + ((idx * 37) % 140),
        y: 120 + ((idx * 53) % 120),
        vx: Math.cos(ang) * 1.4,
        vy: Math.sin(ang) * 1.4,
      };
    });

    let rafId = 0;
    const render = () => {
      const { volumeL: vol, tempK: temp } = stateRef.current;
      const gas = computeIdealGasState(vol, temp, 1.0);
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);

      const cylX = 48;
      const cylW = 190;
      const cylBot = h - 32;
      const chamberH = Math.max(58, Math.min(200, (vol / 16) * 200));
      const pistonY = cylBot - chamberH;

      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.strokeRect(cylX, cylBot - 210, cylW, 210);

      ctx.fillStyle = '#334155';
      ctx.fillRect(cylX + 2, pistonY - 12, cylW - 4, 12);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(cylX + cylW / 2 - 8, 26, 16, pistonY - 38);

      const speedMult = gas.meanSpeedFactor * 1.35;
      const heatHue = Math.max(0, Math.min(200, 200 - ((temp - 200) / 400) * 180));
      ctx.fillStyle = `hsl(${heatHue}, 85%, 62%)`;

      for (const p of particles) {
        p.x += p.vx * speedMult;
        p.y += p.vy * speedMult;
        if (p.x < cylX + 8) {
          p.x = cylX + 8;
          p.vx = Math.abs(p.vx);
        } else if (p.x > cylX + cylW - 8) {
          p.x = cylX + cylW - 8;
          p.vx = -Math.abs(p.vx);
        }
        if (p.y < pistonY + 6) {
          p.y = pistonY + 6;
          p.vy = Math.abs(p.vy);
        } else if (p.y > cylBot - 6) {
          p.y = cylBot - 6;
          p.vy = -Math.abs(p.vy);
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      const gx = 285;
      const gy = 34;
      const gw = w - gx - 28;
      const gh = h - 76;
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(gx, gy, gw, gh);

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let v = 2; v <= 16; v += 0.25) {
        const pVal = computeIdealGasState(v, temp, 1.0).pressureKpa;
        const px = gx + ((v - 2) / 14) * gw;
        const py = gy + gh - Math.min(1, pVal / 2000) * gh;
        if (v === 2) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const curX = gx + ((vol - 2) / 14) * gw;
      const curY = gy + gh - Math.min(1, gas.pressureKpa / 2000) * gh;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(curX, curY, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 11px "JetBrains Mono", monospace';
      ctx.fillText(`P = ${gas.pressureKpa} kPa`, cylX, 20);
      ctx.fillText('PV = nRT Isotherm', gx + 8, gy + 16);
      ctx.fillText('V = 2L', gx, gy + gh + 18);
      ctx.fillText('V = 16L', gx + gw - 46, gy + gh + 18);

      rafId = window.requestAnimationFrame(render);
    };

    rafId = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const gas = computeIdealGasState(volumeL, tempK, 1.0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={640}
          height={290}
          data-testid="gas-laws-canvas"
          className="w-full h-auto block"
        />
      </div>
      <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 space-y-4 text-xs">
        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="gas-vol">Cylinder Volume (V)</label>
            <span className="font-mono text-emerald-300">{volumeL.toFixed(1)} L</span>
          </div>
          <input
            id="gas-vol"
            type="range"
            min={2}
            max={16}
            step={0.5}
            value={volumeL}
            onChange={(e) => setVolumeL(Number(e.target.value))}
            className="w-full accent-emerald-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="gas-temp">Absolute Temp (T)</label>
            <span className="font-mono text-amber-300">{tempK} K</span>
          </div>
          <input
            id="gas-temp"
            type="range"
            min={200}
            max={600}
            step={10}
            value={tempK}
            onChange={(e) => setTempK(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
        </div>

        <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 font-mono tabular-nums">
          <div className="p-2.5 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Pressure P</div>
            <div className="text-emerald-300 font-bold">{gas.pressureKpa} kPa</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">PV Product</div>
            <div className="text-cyan-300 font-bold">{gas.pvProduct} kPa·L</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. TITRATION pH CURVE SIMULATOR (HTML5 Canvas)
export const TitrationSimulator: React.FC = () => {
  const [naohVol, setNaohVol] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const titration = computeTitrationPH(naohVol);

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

    const flaskColor =
      titration.indicatorColor === 'colorless'
        ? 'rgba(226, 232, 240, 0.22)'
        : titration.indicatorColor === 'pale-pink'
          ? 'rgba(244, 114, 182, 0.45)'
          : 'rgba(219, 39, 119, 0.8)';

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.strokeRect(75, 22, 20, 100);
    const buretteFill = Math.max(8, 95 - (naohVol / 50) * 85);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.fillRect(77, 120 - buretteFill, 16, buretteFill);

    ctx.beginPath();
    ctx.moveTo(72, 155);
    ctx.lineTo(98, 155);
    ctx.lineTo(132, 248);
    ctx.lineTo(38, 248);
    ctx.closePath();
    ctx.fillStyle = flaskColor;
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.stroke();

    const gx = 195;
    const gy = 30;
    const gw = w - gx - 28;
    const gh = h - 74;

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(gx, gy, gw, gh);

    const eqX = gx + (25 / 50) * gw;
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(eqX, gy);
    ctx.lineTo(eqX, gy + gh);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let v = 0; v <= 50; v += 0.5) {
      const p = computeTitrationPH(v).ph;
      const px = gx + (v / 50) * gw;
      const py = gy + gh - (p / 14) * gh;
      if (v === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    const curX = gx + (naohVol / 50) * gw;
    const curY = gy + gh - (titration.ph / 14) * gh;
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(curX, curY, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 11px "JetBrains Mono", monospace';
    ctx.fillText('pH 14', gx - 40, gy + 10);
    ctx.fillText('pH 0', gx - 34, gy + gh);
    ctx.fillText('0 cm³', gx, gy + gh + 18);
    ctx.fillText('25 cm³ (Eq)', eqX - 32, gy + gh + 18);
    ctx.fillText('50 cm³', gx + gw - 42, gy + gh + 18);
  }, [naohVol, titration.indicatorColor, titration.ph]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={640}
          height={290}
          data-testid="titration-canvas"
          className="w-full h-auto block"
        />
      </div>

      <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 space-y-4">
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-slate-300 tabular-nums">
            <label htmlFor="titration-vol">Added 0.10 M NaOH</label>
            <span className="font-mono text-emerald-300">{naohVol.toFixed(1)} cm³</span>
          </div>
          <input
            id="titration-vol"
            type="range"
            min={0}
            max={50}
            step={0.5}
            value={naohVol}
            onChange={(e) => setNaohVol(Number(e.target.value))}
            className="w-full accent-emerald-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setNaohVol((v) => Math.min(50, Number((v + 0.5).toFixed(1))))}
            className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors"
          >
            +0.5 cm³ Drop
          </button>
          <button
            type="button"
            onClick={() => setNaohVol(25)}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold transition-colors"
          >
            Endpoint
          </button>
          <button
            type="button"
            onClick={() => setNaohVol(0)}
            aria-label="Reset titration"
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
          <div className="flex justify-between font-mono tabular-nums">
            <span className="text-slate-400">Flask pH</span>
            <span className="text-white font-bold">{titration.ph.toFixed(2)}</span>
          </div>
          <div className="text-[11px] text-emerald-300 font-medium">{titration.stageLabel}</div>
        </div>
      </div>
    </div>
  );
};
