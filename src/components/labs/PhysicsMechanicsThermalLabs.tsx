import React, { useEffect, useRef, useState } from 'react';
import {
  computeCalorimetryEquilibrium,
  computeKinematicsMotion,
  computeSimpleMachineMetrics,
} from '../../utils/labPhysics';

// 10. SIMPLE MACHINES (INCLINED PLANE / PULLEY EFFICIENCY) SIMULATOR (Canvas)
export const SimpleMachineSimulator: React.FC = () => {
  const [effortN, setEffortN] = useState(140);
  const [loadN, setLoadN] = useState(400);
  const [inclineDeg, setInclineDeg] = useState(20);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const idealVR = Number((1 / Math.sin((inclineDeg * Math.PI) / 180)).toFixed(2));
  const stats = computeSimpleMachineMetrics(effortN, loadN, idealVR, inclineDeg);

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

    const baseLeftX = 85;
    const baseY = 236;
    const baseLen = 360;
    const rad = (inclineDeg * Math.PI) / 180;
    const riseH = Math.min(165, baseLen * Math.tan(rad));
    const topX = baseLeftX + baseLen;
    const topY = baseY - riseH;

    ctx.fillStyle = 'rgba(20, 184, 166, 0.14)';
    ctx.strokeStyle = '#14b8a6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(baseLeftX, baseY);
    ctx.lineTo(topX, baseY);
    ctx.lineTo(topX, topY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const midX = (baseLeftX + topX) / 2;
    const midY = (baseY + topY) / 2;
    ctx.save();
    ctx.translate(midX, midY);
    ctx.rotate(-rad);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-24, -34, 48, 34);
    ctx.fillStyle = '#0f172a';
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.fillText(`${loadN}N`, -18, -13);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(24, -17);
    ctx.lineTo(82, -17);
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`E=${effortN}N`, 30, -25);
    ctx.restore();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '500 11px "JetBrains Mono", monospace';
    ctx.fillText(`θ = ${inclineDeg}°   |   VR = 1/sinθ = ${stats.idealVelocityRatio}`, 24, 24);
    ctx.fillText(`MA = L/E = ${stats.mechanicalAdvantage}   |   Efficiency η = ${stats.efficiencyPct}%`, 24, 44);
  }, [effortN, loadN, inclineDeg, stats.idealVelocityRatio, stats.mechanicalAdvantage, stats.efficiencyPct]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={640}
          height={290}
          data-testid="simple-machine-canvas"
          className="w-full h-auto block"
        />
      </div>

      <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 space-y-3.5 text-xs">
        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="mach-load">Load Weight (L)</label>
            <span className="font-mono text-amber-300">{loadN} N</span>
          </div>
          <input
            id="mach-load"
            type="range"
            min={100}
            max={800}
            step={20}
            value={loadN}
            onChange={(e) => setLoadN(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="mach-effort">Applied Effort (E)</label>
            <span className="font-mono text-cyan-300">{effortN} N</span>
          </div>
          <input
            id="mach-effort"
            type="range"
            min={50}
            max={400}
            step={10}
            value={effortN}
            onChange={(e) => setEffortN(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="mach-angle">Slope Angle (θ)</label>
            <span className="font-mono text-teal-300">{inclineDeg}°</span>
          </div>
          <input
            id="mach-angle"
            type="range"
            min={10}
            max={45}
            step={1}
            value={inclineDeg}
            onChange={(e) => setInclineDeg(Number(e.target.value))}
            className="w-full accent-teal-400"
          />
        </div>

        <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-2 font-mono tabular-nums">
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">MA</div>
            <div className="text-amber-300 font-bold">{stats.mechanicalAdvantage}</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">VR</div>
            <div className="text-cyan-300 font-bold">{stats.idealVelocityRatio}</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Efficiency</div>
            <div className="text-teal-300 font-bold">{stats.efficiencyPct}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 11. GRADE 10 (SHS 1) KINEMATICS MOTION & VELOCITY-TIME GRAPH SIMULATOR
export const KinematicsMotionSimulator: React.FC = () => {
  const [u0, setU0] = useState(4);
  const [accel, setAccel] = useState(2.0);
  const [timeSec, setTimeSec] = useState(6.0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const metrics = computeKinematicsMotion(u0, accel, timeSec);

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

    const trackY = h - 48;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(32, trackY);
    ctx.lineTo(w - 32, trackY);
    ctx.stroke();

    const maxTrackDisp = 240;
    const clampedFrac = Math.max(0, Math.min(1, metrics.displacementM / maxTrackDisp));
    const cartX = 48 + clampedFrac * (w - 116);
    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.roundRect(cartX - 20, trackY - 24, 40, 20, 5);
    ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(cartX - 11, trackY - 3, 5, 0, Math.PI * 2);
    ctx.arc(cartX + 11, trackY - 3, 5, 0, Math.PI * 2);
    ctx.fill();

    const gx = 54;
    const gy = 30;
    const gw = w - 92;
    const gh = 165;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(gx, gy, gw, gh);

    const vMaxPlot = 60;
    const mapX = (t: number) => gx + (t / 12) * gw;
    const mapY = (v: number) => gy + gh - Math.max(0, Math.min(1, v / vMaxPlot)) * gh;

    ctx.fillStyle = 'rgba(34, 211, 238, 0.18)';
    ctx.beginPath();
    ctx.moveTo(mapX(0), mapY(0));
    ctx.lineTo(mapX(0), mapY(u0));
    ctx.lineTo(mapX(timeSec), mapY(metrics.finalVelocityMs));
    ctx.lineTo(mapX(timeSec), mapY(0));
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(mapX(0), mapY(u0));
    ctx.lineTo(mapX(timeSec), mapY(metrics.finalVelocityMs));
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(mapX(timeSec), mapY(metrics.finalVelocityMs), 5.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '500 11px "JetBrains Mono", monospace';
    ctx.fillText(`v-t Graph (Slope = a = ${accel.toFixed(1)} m/s²  |  Area = s = ${metrics.displacementM} m)`, gx, 18);
  }, [u0, accel, timeSec, metrics.displacementM, metrics.finalVelocityMs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <canvas ref={canvasRef} width={640} height={290} data-testid="kinematics-canvas" className="w-full h-auto block" />
      </div>
      <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 space-y-3.5 text-xs">
        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="kin-u">Initial Velocity (u)</label>
            <span className="font-mono text-cyan-300">{u0} m/s</span>
          </div>
          <input id="kin-u" type="range" min={0} max={20} step={1} value={u0} onChange={(e) => setU0(Number(e.target.value))} className="w-full accent-cyan-400" />
        </div>
        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="kin-a">Acceleration (a)</label>
            <span className="font-mono text-amber-300">{accel.toFixed(1)} m/s²</span>
          </div>
          <input id="kin-a" type="range" min={-2} max={6} step={0.5} value={accel} onChange={(e) => setAccel(Number(e.target.value))} className="w-full accent-amber-400" />
        </div>
        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="kin-t">Elapsed Time (t)</label>
            <span className="font-mono text-emerald-300">{timeSec.toFixed(1)} s</span>
          </div>
          <input id="kin-t" type="range" min={1} max={12} step={0.5} value={timeSec} onChange={(e) => setTimeSec(Number(e.target.value))} className="w-full accent-emerald-400" />
        </div>
        <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 font-mono tabular-nums">
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Final v = u+at</div>
            <div className="text-cyan-300 font-bold">{metrics.finalVelocityMs} m/s</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Distance (s)</div>
            <div className="text-emerald-300 font-bold">{metrics.displacementM} m</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 12. GRADE 10 (SHS 1) THERMAL CALORIMETRY SIMULATOR
export const ThermalCalorimetrySimulator: React.FC = () => {
  const [metalMass, setMetalMass] = useState(0.5);
  const [metalC, setMetalC] = useState(390);
  const [metalTemp, setMetalTemp] = useState(100);
  const [waterMass, setWaterMass] = useState(0.4);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const res = computeCalorimetryEquilibrium(metalMass, metalC, metalTemp, waterMass, 25);

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

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.strokeRect(86, 62, 190, 180);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.fillRect(88, 120, 186, 120);

    const heatNorm = Math.max(0, Math.min(1, (res.equilibriumTempC - 25) / 45));
    ctx.fillStyle = `rgb(${Math.round(140 + 110 * heatNorm)}, ${Math.round(120 - 40 * heatNorm)}, 85)`;
    ctx.fillRect(150, 165, 62, 54);

    const barX = 360;
    const barW = 220;
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(barX, 68, barW, 174);

    ctx.fillStyle = '#f59e0b';
    const eqRatio = Math.min(1, res.equilibriumTempC / 100);
    ctx.fillRect(barX + 24, 212 - eqRatio * 120, 36, eqRatio * 120);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 12px "JetBrains Mono", monospace';
    ctx.fillText(`Equilibrium Temp: ${res.equilibriumTempC.toFixed(2)} °C`, 86, 36);
    ctx.fillText(`Heat Lost = ${res.heatLostByMetalJ} J`, barX + 82, 120);
    ctx.fillText(`Heat Gained = ${res.heatGainedByWaterJ} J`, barX + 82, 150);
    ctx.fillStyle = '#34d399';
    ctx.fillText('Energy Conserved!', barX + 82, 190);
  }, [res.equilibriumTempC, res.heatLostByMetalJ, res.heatGainedByWaterJ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <canvas ref={canvasRef} width={640} height={290} data-testid="calorimetry-canvas" className="w-full h-auto block" />
      </div>
      <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 space-y-3 text-xs">
        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="cal-mass">Metal Mass</label>
            <span className="font-mono text-amber-300">{metalMass.toFixed(2)} kg</span>
          </div>
          <input id="cal-mass" type="range" min={0.1} max={1.5} step={0.1} value={metalMass} onChange={(e) => setMetalMass(Number(e.target.value))} className="w-full accent-amber-400" />
        </div>
        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="cal-spec">Metal Specific Heat (c)</label>
            <span className="font-mono text-cyan-300">{metalC} J/(kg·K)</span>
          </div>
          <input id="cal-spec" type="range" min={130} max={900} step={20} value={metalC} onChange={(e) => setMetalC(Number(e.target.value))} className="w-full accent-cyan-400" />
        </div>
        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="cal-temp">Initial Metal Temp</label>
            <span className="font-mono text-rose-300">{metalTemp} °C</span>
          </div>
          <input id="cal-temp" type="range" min={50} max={180} step={5} value={metalTemp} onChange={(e) => setMetalTemp(Number(e.target.value))} className="w-full accent-rose-400" />
        </div>
        <div>
          <div className="flex justify-between text-slate-300 mb-1 tabular-nums">
            <label htmlFor="cal-wmass">Water Mass (25 °C)</label>
            <span className="font-mono text-emerald-300">{waterMass.toFixed(2)} kg</span>
          </div>
          <input id="cal-wmass" type="range" min={0.2} max={1.2} step={0.1} value={waterMass} onChange={(e) => setWaterMass(Number(e.target.value))} className="w-full accent-emerald-400" />
        </div>
        <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 font-mono tabular-nums">
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Final T_eq</div>
            <div className="text-amber-300 font-bold">{res.equilibriumTempC} °C</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900">
            <div className="text-[10px] text-slate-400">Q Transfer</div>
            <div className="text-cyan-300 font-bold">{res.heatGainedByWaterJ} J</div>
          </div>
        </div>
      </div>
    </div>
  );
};
