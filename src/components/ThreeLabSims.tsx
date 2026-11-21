import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Pause, Play, RotateCcw } from 'lucide-react';
import {
  computeMicrometerReading,
  computePendulumMetrics,
  computeProjectileMetrics,
  computeThinLensImage,
  sampleProjectilePosition,
} from '../utils/labPhysics';
import {
  createRadialContactShadowTexture,
  ThreeLabViewport,
  type CameraPreset,
  type ThreeSceneContext,
} from './ThreeLabViewport';

const _vecA = new THREE.Vector3();
const _vecB = new THREE.Vector3();
const _quatA = new THREE.Quaternion();
const _up = new THREE.Vector3(0, 1, 0);
const _mat4 = new THREE.Matrix4();

function createBenchGridTexture(accentHex = '#22d3ee'): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#0c1220';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= size; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }
    ctx.strokeStyle = accentHex;
    ctx.globalAlpha = 0.22;
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, size - 4, size - 4);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  return tex;
}

// =============================================================================
// 1. 3D PROJECTILE TRAJECTORY & CANNON LAB
// =============================================================================
const PROJECTILE_PRESETS: CameraPreset[] = [
  { id: 'side', label: 'Range View', position: [-0.2, 3.8, 10.6], target: [-0.4, 1.5, 0] },
  { id: 'iso', label: '3/4 Isometric', position: [-7.5, 5.2, 9.6], target: [-0.2, 1.5, 0] },
  { id: 'top', label: 'Overhead', position: [0, 13.5, 2.5], target: [0, 0, 0] },
];

export const Projectile3DSim: React.FC = () => {
  const [velocity, setVelocity] = useState(22);
  const [angle, setAngle] = useState(45);
  const [gravity, setGravity] = useState(9.81);
  const [playing, setPlaying] = useState(true);
  const [resetTick, setResetTick] = useState(0);

  const metrics = useMemo(
    () => computeProjectileMetrics(velocity, angle, gravity),
    [velocity, angle, gravity]
  );

  const stateRef = useRef({ velocity, angle, gravity, playing, resetSignal: 0 });
  useEffect(() => {
    stateRef.current.velocity = velocity;
    stateRef.current.angle = angle;
    stateRef.current.gravity = gravity;
    stateRef.current.playing = playing;
  }, [velocity, angle, gravity, playing]);

  const handleBuildScene = (ctx: ThreeSceneContext) => {
    const { scene, registerDisposable, maxAnisotropy } = ctx;
    const SCALE = 0.16;
    const ORIGIN_X = -4.6;

    // Range terrain disc with distance rings
    const ringCanvas = document.createElement('canvas');
    ringCanvas.width = 512;
    ringCanvas.height = 512;
    const rCtx = ringCanvas.getContext('2d');
    if (rCtx) {
      rCtx.fillStyle = '#0b111e';
      rCtx.fillRect(0, 0, 512, 512);
      rCtx.strokeStyle = 'rgba(56, 189, 248, 0.16)';
      rCtx.lineWidth = 2;
      for (let r = 48; r <= 240; r += 48) {
        rCtx.beginPath();
        rCtx.arc(256, 256, r, 0, Math.PI * 2);
        rCtx.stroke();
      }
      rCtx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
      rCtx.lineWidth = 1;
      for (let x = 0; x < 512; x += 32) {
        rCtx.beginPath();
        rCtx.moveTo(x, 0);
        rCtx.lineTo(x, 512);
        rCtx.stroke();
        rCtx.beginPath();
        rCtx.moveTo(0, x);
        rCtx.lineTo(512, x);
        rCtx.stroke();
      }
    }
    const groundTex = new THREE.CanvasTexture(ringCanvas);
    groundTex.colorSpace = THREE.SRGBColorSpace;
    groundTex.anisotropy = maxAnisotropy;
    registerDisposable(groundTex);

    const groundGeo = new THREE.CircleGeometry(24, 48);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: groundTex,
      roughness: 0.85,
      metalness: 0.08,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    registerDisposable(groundGeo);
    registerDisposable(groundMat);

    // Distance meter posts along X axis (InstancedMesh)
    const postGeo = new THREE.CylinderGeometry(0.035, 0.045, 0.45, 10);
    const postMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.4,
      metalness: 0.3,
    });
    const postCount = 22;
    const posts = new THREE.InstancedMesh(postGeo, postMat, postCount);
    for (let i = 0; i < postCount; i++) {
      const mx = ORIGIN_X + (i % 11) * 1.1;
      const mz = i < 11 ? -1.4 : 1.4;
      _mat4.makeTranslation(mx, 0.225, mz);
      posts.setMatrixAt(i, _mat4);
    }
    posts.instanceMatrix.needsUpdate = true;
    posts.computeBoundingSphere();
    scene.add(posts);
    registerDisposable(postGeo);
    registerDisposable(postMat);

    // Contact shadow under cannon
    const shadowTex = createRadialContactShadowTexture();
    registerDisposable(shadowTex);
    const cannonShadowGeo = new THREE.CircleGeometry(1.15, 24);
    const cannonShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
    });
    const cannonShadow = new THREE.Mesh(cannonShadowGeo, cannonShadowMat);
    cannonShadow.rotation.x = -Math.PI / 2;
    cannonShadow.position.set(ORIGIN_X, 0.015, 0);
    scene.add(cannonShadow);
    registerDisposable(cannonShadowGeo);
    registerDisposable(cannonShadowMat);

    // Composite 6-part Brass & Cast-Iron Launcher Group
    const launcher = new THREE.Group();
    launcher.position.set(ORIGIN_X, 0, 0);

    const ironMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      roughness: 0.78,
      metalness: 0.35,
    });
    const brassMat = new THREE.MeshPhysicalMaterial({
      color: 0xd9a441,
      roughness: 0.22,
      metalness: 0.9,
      anisotropy: 0.7,
    });
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.25,
      metalness: 0.88,
    });
    registerDisposable(ironMat);
    registerDisposable(brassMat);
    registerDisposable(steelMat);

    // Part 1: Cast-iron heavy base plate
    const baseGeo = new THREE.CylinderGeometry(0.65, 0.76, 0.16, 20);
    const baseMesh = new THREE.Mesh(baseGeo, ironMat);
    baseMesh.position.y = 0.08;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    launcher.add(baseMesh);
    registerDisposable(baseGeo);

    // Part 2 & 3: Twin trunnion stanchions
    const yokeGeo = new THREE.BoxGeometry(0.14, 0.62, 0.16);
    const yokeL = new THREE.Mesh(yokeGeo, ironMat);
    yokeL.position.set(0, 0.46, -0.26);
    yokeL.castShadow = true;
    const yokeR = new THREE.Mesh(yokeGeo, ironMat);
    yokeR.position.set(0, 0.46, 0.26);
    yokeR.castShadow = true;
    launcher.add(yokeL, yokeR);
    registerDisposable(yokeGeo);

    // Part 4: Trunnion axle pin
    const axleGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.66, 16);
    axleGeo.rotateX(Math.PI / 2);
    const axleMesh = new THREE.Mesh(axleGeo, steelMat);
    axleMesh.position.set(0, 0.68, 0);
    launcher.add(axleMesh);
    registerDisposable(axleGeo);

    // Part 5: Protractor degree arc
    const arcGeo = new THREE.TorusGeometry(0.45, 0.025, 10, 28, Math.PI * 0.55);
    const arcMesh = new THREE.Mesh(arcGeo, brassMat);
    arcMesh.position.set(0, 0.68, 0.3);
    launcher.add(arcMesh);
    registerDisposable(arcGeo);

    // Part 6: Pivoting Lathe Brass Barrel
    const barrelPivot = new THREE.Group();
    barrelPivot.position.set(0, 0.68, 0);
    const lathePts = [
      new THREE.Vector2(0.02, -0.35),
      new THREE.Vector2(0.19, -0.35),
      new THREE.Vector2(0.21, -0.2),
      new THREE.Vector2(0.15, 0.45),
      new THREE.Vector2(0.18, 0.85),
      new THREE.Vector2(0.14, 0.88),
      new THREE.Vector2(0.1, 0.85),
    ];
    const barrelGeo = new THREE.LatheGeometry(lathePts, 24);
    barrelGeo.rotateZ(-Math.PI / 2); // point along +X
    const barrelMesh = new THREE.Mesh(barrelGeo, brassMat);
    barrelMesh.castShadow = true;
    barrelPivot.add(barrelMesh);
    registerDisposable(barrelGeo);

    // Barrel muzzle collar
    const collarGeo = new THREE.TorusGeometry(0.155, 0.028, 12, 24);
    collarGeo.rotateY(Math.PI / 2);
    const collarMesh = new THREE.Mesh(collarGeo, steelMat);
    collarMesh.position.x = 0.84;
    barrelPivot.add(collarMesh);
    registerDisposable(collarGeo);

    launcher.add(barrelPivot);
    scene.add(launcher);

    // Steel Projectile Sphere + ground drop shadow
    const ballGeo = new THREE.SphereGeometry(0.14, 24, 24);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.35,
      roughness: 0.18,
      metalness: 0.9,
    });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.castShadow = true;
    scene.add(ball);
    registerDisposable(ballGeo);
    registerDisposable(ballMat);

    const ballShadowGeo = new THREE.CircleGeometry(0.24, 18);
    const ballShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const ballShadow = new THREE.Mesh(ballShadowGeo, ballShadowMat);
    ballShadow.rotation.x = -Math.PI / 2;
    ballShadow.position.y = 0.02;
    scene.add(ballShadow);
    registerDisposable(ballShadowGeo);
    registerDisposable(ballShadowMat);

    // Parabolic Trajectory Tube + Landing Target Ring
    const trajMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.85,
      roughness: 0.3,
      metalness: 0.2,
      transparent: true,
      opacity: 0.9,
    });
    registerDisposable(trajMat);

    const targetRingGeo = new THREE.RingGeometry(0.18, 0.3, 24);
    targetRingGeo.rotateX(-Math.PI / 2);
    const targetRingMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      side: THREE.DoubleSide,
    });
    const targetRing = new THREE.Mesh(targetRingGeo, targetRingMat);
    targetRing.position.set(ORIGIN_X + 6, 0.025, 0);
    scene.add(targetRing);
    registerDisposable(targetRingGeo);
    registerDisposable(targetRingMat);

    let trajMesh: THREE.Mesh | null = null;
    let lastV = -1;
    let lastA = -1;
    let lastG = -1;
    let simT = 0;
    let lastResetSeen = stateRef.current.resetSignal;

    const rebuildTrajectory = (v: number, a: number, g: number) => {
      const m = computeProjectileMetrics(v, a, g);
      const pts: THREE.Vector3[] = [];
      const steps = 40;
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * m.timeOfFlight;
        const p = sampleProjectilePosition(v, a, t, g);
        pts.push(new THREE.Vector3(ORIGIN_X + p.x * SCALE, 0.68 + p.y * SCALE, 0));
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      const newGeo = new THREE.TubeGeometry(curve, 48, 0.045, 10, false);
      if (trajMesh) {
        scene.remove(trajMesh);
        trajMesh.geometry.dispose();
      }
      trajMesh = new THREE.Mesh(newGeo, trajMat);
      scene.add(trajMesh);
      targetRing.position.set(ORIGIN_X + m.horizontalRange * SCALE, 0.025, 0);
    };

    return {
      onFrame: (dt: number) => {
        const st = stateRef.current;
        if (st.resetSignal !== lastResetSeen) {
          lastResetSeen = st.resetSignal;
          simT = 0;
        }
        if (st.velocity !== lastV || st.angle !== lastA || st.gravity !== lastG) {
          lastV = st.velocity;
          lastA = st.angle;
          lastG = st.gravity;
          rebuildTrajectory(st.velocity, st.angle, st.gravity);
          barrelPivot.rotation.z = (st.angle * Math.PI) / 180;
          simT = 0;
        }

        const m = computeProjectileMetrics(st.velocity, st.angle, st.gravity);
        if (st.playing && dt > 0) {
          simT += dt;
          if (simT > m.timeOfFlight + 0.5) simT = 0;
        }

        const clampedT = Math.min(simT, m.timeOfFlight);
        const pos = sampleProjectilePosition(st.velocity, st.angle, clampedT, st.gravity);
        const wx = ORIGIN_X + pos.x * SCALE;
        const wy = Math.max(0.14, 0.68 + pos.y * SCALE);
        ball.position.set(wx, wy, 0);
        ballShadow.position.set(wx, 0.02, 0);
        const shadowScale = Math.max(0.45, 1 - pos.y * 0.02);
        ballShadow.scale.setScalar(shadowScale);
        return st.playing;
      },
      dispose: () => {
        if (trajMesh) {
          trajMesh.geometry.dispose();
        }
      },
    };
  };

  return (
    <ThreeLabViewport
      testId="projectile-3d"
      title="3D Ballistic Trajectory"
      badgeText="Three.js PBR"
      readoutText={`Range R = ${metrics.horizontalRange.toFixed(1)} m  ·  Apex H = ${metrics.maxHeight.toFixed(1)} m  ·  Flight T = ${metrics.timeOfFlight.toFixed(2)} s`}
      presets={PROJECTILE_PRESETS}
      isAnimating={playing}
      renderTrigger={velocity + angle * 100 + gravity * 1000 + resetTick}
      onBuildScene={handleBuildScene}
    >
      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
      >
        {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        <span>{playing ? 'Pause' : 'Play'}</span>
      </button>
      <button
        type="button"
        onClick={() => {
          stateRef.current.resetSignal += 1;
          setResetTick((t) => t + 1);
          setPlaying(true);
        }}
        aria-label="Replay launch"
        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      <label className="flex items-center gap-2 text-xs text-slate-200 tabular-nums">
        <span>u = {velocity} m/s</span>
        <input
          type="range"
          aria-label="Launch Speed"
          min={12}
          max={28}
          step={1}
          value={velocity}
          onChange={(e) => setVelocity(Number(e.target.value))}
          className="w-24 accent-cyan-400"
        />
      </label>

      <label className="flex items-center gap-2 text-xs text-slate-200 tabular-nums">
        <span>θ = {angle}°</span>
        <input
          type="range"
          aria-label="Launch Angle"
          min={15}
          max={75}
          step={1}
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
          className="w-24 accent-amber-400"
        />
      </label>

      <label className="flex items-center gap-2 text-xs text-slate-200 tabular-nums">
        <span>g = {gravity.toFixed(2)} m/s²</span>
        <input
          type="range"
          aria-label="Gravity"
          min={1.62}
          max={15}
          step={0.1}
          value={gravity}
          onChange={(e) => setGravity(Number(e.target.value))}
          className="w-20 accent-emerald-400"
        />
      </label>
    </ThreeLabViewport>
  );
};

// =============================================================================
// 2. 3D SIMPLE PENDULUM LAB
// =============================================================================
const PENDULUM_PRESETS: CameraPreset[] = [
  { id: 'front', label: 'Front View', position: [0, 2.4, 7.6], target: [0, 1.9, 0] },
  { id: 'iso', label: '3/4 Studio', position: [4.8, 3.2, 6.2], target: [0, 1.8, 0] },
  { id: 'bob', label: 'Bob Close-Up', position: [2.2, 1.3, 3.4], target: [0, 1.2, 0] },
];

export const Pendulum3DSim: React.FC = () => {
  const [lengthM, setLengthM] = useState(1.2);
  const [angleDeg, setAngleDeg] = useState(15);
  const [gravity, setGravity] = useState(9.81);
  const [swinging, setSwinging] = useState(true);

  const metrics = useMemo(
    () => computePendulumMetrics(lengthM, gravity, angleDeg),
    [lengthM, gravity, angleDeg]
  );

  const stateRef = useRef({ lengthM, angleDeg, gravity, swinging });
  useEffect(() => {
    stateRef.current = { lengthM, angleDeg, gravity, swinging };
  }, [lengthM, angleDeg, gravity, swinging]);

  const handleBuildScene = (ctx: ThreeSceneContext) => {
    const { scene, registerDisposable, maxAnisotropy } = ctx;

    // Benchtop Surface
    const benchTex = createBenchGridTexture('#38bdf8');
    benchTex.anisotropy = maxAnisotropy;
    registerDisposable(benchTex);

    const benchGeo = new THREE.BoxGeometry(11, 0.25, 6);
    const benchMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: benchTex,
      roughness: 0.78,
      metalness: 0.12,
    });
    const bench = new THREE.Mesh(benchGeo, benchMat);
    bench.position.y = -0.125;
    bench.receiveShadow = true;
    scene.add(bench);
    registerDisposable(benchGeo);
    registerDisposable(benchMat);

    // Contact shadow under retort base
    const shadowTex = createRadialContactShadowTexture();
    registerDisposable(shadowTex);
    const standShadowGeo = new THREE.CircleGeometry(1.3, 24);
    const standShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const standShadow = new THREE.Mesh(standShadowGeo, standShadowMat);
    standShadow.rotation.x = -Math.PI / 2;
    standShadow.position.set(0, 0.015, -0.45);
    scene.add(standShadow);
    registerDisposable(standShadowGeo);
    registerDisposable(standShadowMat);

    // Composite Retort Stand (6+ parts)
    const apparatus = new THREE.Group();
    const castIronMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.82,
      metalness: 0.3,
    });
    const chromeMat = new THREE.MeshPhysicalMaterial({
      color: 0xdbeafe,
      roughness: 0.16,
      metalness: 0.94,
      anisotropy: 0.65,
    });
    const brassMat = new THREE.MeshPhysicalMaterial({
      color: 0xeab308,
      roughness: 0.2,
      metalness: 0.92,
      anisotropy: 0.75,
    });
    registerDisposable(castIronMat);
    registerDisposable(chromeMat);
    registerDisposable(brassMat);

    // Base plate
    const baseGeo = new THREE.BoxGeometry(2.1, 0.14, 1.3);
    const baseMesh = new THREE.Mesh(baseGeo, castIronMat);
    baseMesh.position.set(0, 0.07, -0.45);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    apparatus.add(baseMesh);
    registerDisposable(baseGeo);

    // Vertical Retort Column
    const poleGeo = new THREE.CylinderGeometry(0.06, 0.06, 4.1, 18);
    const poleMesh = new THREE.Mesh(poleGeo, chromeMat);
    poleMesh.position.set(0, 2.12, -0.78);
    poleMesh.castShadow = true;
    apparatus.add(poleMesh);
    registerDisposable(poleGeo);

    // Bosshead Clamp + Horizontal Cantilever Arm
    const clampGeo = new THREE.BoxGeometry(0.24, 0.28, 0.28);
    const clampMesh = new THREE.Mesh(clampGeo, castIronMat);
    clampMesh.position.set(0, 3.85, -0.78);
    apparatus.add(clampMesh);
    registerDisposable(clampGeo);

    const armGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.0, 14);
    armGeo.rotateX(Math.PI / 2);
    const armMesh = new THREE.Mesh(armGeo, chromeMat);
    armMesh.position.set(0, 3.85, -0.35);
    armMesh.castShadow = true;
    apparatus.add(armMesh);
    registerDisposable(armGeo);

    // Protractor Dial at Pivot
    const protCanvas = document.createElement('canvas');
    protCanvas.width = 256;
    protCanvas.height = 128;
    const pCtx = protCanvas.getContext('2d');
    if (pCtx) {
      pCtx.clearRect(0, 0, 256, 128);
      pCtx.fillStyle = 'rgba(217, 164, 65, 0.25)';
      pCtx.beginPath();
      pCtx.arc(128, 0, 120, 0, Math.PI);
      pCtx.fill();
      pCtx.strokeStyle = '#fbbf24';
      pCtx.lineWidth = 3;
      pCtx.beginPath();
      pCtx.arc(128, 0, 118, 0, Math.PI);
      pCtx.stroke();
      pCtx.strokeStyle = '#fde68a';
      pCtx.lineWidth = 1.5;
      for (let deg = -60; deg <= 60; deg += 15) {
        const rad = ((90 + deg) * Math.PI) / 180;
        pCtx.beginPath();
        pCtx.moveTo(128 + Math.cos(rad) * 95, Math.sin(rad) * 95);
        pCtx.lineTo(128 + Math.cos(rad) * 118, Math.sin(rad) * 118);
        pCtx.stroke();
      }
    }
    const protTex = new THREE.CanvasTexture(protCanvas);
    protTex.colorSpace = THREE.SRGBColorSpace;
    protTex.anisotropy = maxAnisotropy;
    registerDisposable(protTex);

    const protGeo = new THREE.PlaneGeometry(0.9, 0.45);
    const protMat = new THREE.MeshBasicMaterial({
      map: protTex,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const protMesh = new THREE.Mesh(protGeo, protMat);
    protMesh.position.set(0, 3.62, -0.05);
    apparatus.add(protMesh);
    registerDisposable(protGeo);
    registerDisposable(protMat);

    // Swinging Pendulum Pivot Group
    const pivot = new THREE.Group();
    pivot.position.set(0, 3.85, 0.08);

    const cordGeo = new THREE.CylinderGeometry(0.012, 0.012, 1, 8);
    cordGeo.translate(0, -0.5, 0); // anchored at y=0 downwards
    const cordMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.45,
      metalness: 0.5,
    });
    const cord = new THREE.Mesh(cordGeo, cordMat);
    pivot.add(cord);
    registerDisposable(cordGeo);
    registerDisposable(cordMat);

    // Lathe-turned Brass Bob
    const bobPts = [
      new THREE.Vector2(0.001, -0.24),
      new THREE.Vector2(0.11, -0.18),
      new THREE.Vector2(0.21, -0.04),
      new THREE.Vector2(0.21, 0.06),
      new THREE.Vector2(0.1, 0.16),
      new THREE.Vector2(0.03, 0.22),
      new THREE.Vector2(0.001, 0.22),
    ];
    const bobGeo = new THREE.LatheGeometry(bobPts, 24);
    const bobMesh = new THREE.Mesh(bobGeo, brassMat);
    bobMesh.castShadow = true;
    pivot.add(bobMesh);
    registerDisposable(bobGeo);

    apparatus.add(pivot);
    scene.add(apparatus);

    // Moving Bob Shadow on bench
    const bobShadowGeo = new THREE.CircleGeometry(0.26, 18);
    const bobShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
    const bobShadow = new THREE.Mesh(bobShadowGeo, bobShadowMat);
    bobShadow.rotation.x = -Math.PI / 2;
    bobShadow.position.set(0, 0.02, 0.08);
    scene.add(bobShadow);
    registerDisposable(bobShadowGeo);
    registerDisposable(bobShadowMat);

    let phase = 0;

    return {
      onFrame: (dt: number) => {
        const st = stateRef.current;
        const m = computePendulumMetrics(st.lengthM, st.gravity, st.angleDeg);
        const visualLen = 0.75 + st.lengthM * 1.15; // maps 0.4m..2.0m -> 1.21..3.05
        cord.scale.set(1, visualLen, 1);
        bobMesh.position.set(0, -visualLen, 0);

        if (st.swinging && dt > 0) {
          phase += m.angularFrequency * dt;
        }
        const thetaMax = (st.angleDeg * Math.PI) / 180;
        const theta = thetaMax * Math.cos(phase);
        pivot.rotation.z = theta;

        const bobX = Math.sin(theta) * visualLen;
        bobShadow.position.set(bobX, 0.02, 0.08);
        return st.swinging;
      },
    };
  };

  return (
    <ThreeLabViewport
      testId="pendulum-3d"
      title="Simple Pendulum & SHM"
      badgeText="Three.js PBR"
      readoutText={`Period T = ${metrics.periodSeconds.toFixed(3)} s  ·  Frequency f = ${metrics.frequencyHz.toFixed(2)} Hz  ·  v_max = ${metrics.maxSpeedMs.toFixed(2)} m/s`}
      presets={PENDULUM_PRESETS}
      isAnimating={swinging}
      renderTrigger={lengthM * 100 + angleDeg * 10 + gravity}
      onBuildScene={handleBuildScene}
    >
      <button
        type="button"
        onClick={() => setSwinging((s) => !s)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
      >
        {swinging ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        <span>{swinging ? 'Pause' : 'Swing'}</span>
      </button>

      <label className="flex items-center gap-2 text-xs text-slate-200 tabular-nums">
        <span>L = {lengthM.toFixed(2)} m</span>
        <input
          type="range"
          aria-label="Pendulum Length"
          min={0.4}
          max={2.0}
          step={0.05}
          value={lengthM}
          onChange={(e) => setLengthM(Number(e.target.value))}
          className="w-24 accent-cyan-400"
        />
      </label>

      <label className="flex items-center gap-2 text-xs text-slate-200 tabular-nums">
        <span>θ₀ = {angleDeg}°</span>
        <input
          type="range"
          aria-label="Release Angle"
          min={4}
          max={30}
          step={1}
          value={angleDeg}
          onChange={(e) => setAngleDeg(Number(e.target.value))}
          className="w-20 accent-amber-400"
        />
      </label>

      <label className="flex items-center gap-2 text-xs text-slate-200 tabular-nums">
        <span>g = {gravity.toFixed(2)}</span>
        <input
          type="range"
          aria-label="Gravity"
          min={1.62}
          max={14}
          step={0.1}
          value={gravity}
          onChange={(e) => setGravity(Number(e.target.value))}
          className="w-20 accent-emerald-400"
        />
      </label>
    </ThreeLabViewport>
  );
};

// =============================================================================
// 3. 3D THIN CONVEX LENS OPTICAL BENCH LAB
// =============================================================================
const OPTICS_PRESETS: CameraPreset[] = [
  { id: 'side', label: 'Bench Side', position: [0.2, 2.3, 8.2], target: [0, 1.15, 0] },
  { id: 'iso', label: '3/4 Optical', position: [-5.4, 3.3, 6.2], target: [0.3, 1.15, 0] },
  { id: 'lens', label: 'Lens Focus', position: [2.2, 1.7, 3.1], target: [0, 1.25, 0] },
];

export const OpticsBench3DSim: React.FC = () => {
  const [objectDistCm, setObjectDistCm] = useState(32);
  const [focalLengthCm, setFocalLengthCm] = useState(14);
  const lensResult = useMemo(
    () => computeThinLensImage(objectDistCm, focalLengthCm),
    [objectDistCm, focalLengthCm]
  );

  const stateRef = useRef({ objectDistCm, focalLengthCm });
  useEffect(() => {
    stateRef.current = { objectDistCm, focalLengthCm };
  }, [objectDistCm, focalLengthCm]);

  const handleBuildScene = (ctx: ThreeSceneContext) => {
    const { scene, registerDisposable, maxAnisotropy, isSoftwareGl } = ctx;
    const CM_SCALE = 0.085; // 50 cm -> 4.25 world units

    // Bench Plane
    const benchTex = createBenchGridTexture('#38bdf8');
    benchTex.anisotropy = maxAnisotropy;
    registerDisposable(benchTex);

    const floorGeo = new THREE.BoxGeometry(12, 0.2, 6);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: benchTex,
      roughness: 0.82,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.1;
    floor.receiveShadow = true;
    scene.add(floor);
    registerDisposable(floorGeo);
    registerDisposable(floorMat);

    // Graduated Optical Rail (Anodized Aluminum)
    const railCanvas = document.createElement('canvas');
    railCanvas.width = 1024;
    railCanvas.height = 128;
    const rc = railCanvas.getContext('2d');
    if (rc) {
      rc.fillStyle = '#334155';
      rc.fillRect(0, 0, 1024, 128);
      rc.fillStyle = '#cbd5e1';
      rc.fillRect(0, 10, 1024, 14);
      for (let i = 0; i <= 100; i++) {
        const x = (i / 100) * 1000 + 12;
        const tall = i % 10 === 0 ? 36 : i % 5 === 0 ? 24 : 14;
        rc.fillStyle = '#e2e8f0';
        rc.fillRect(x, 30, 2, tall);
      }
    }
    const railTex = new THREE.CanvasTexture(railCanvas);
    railTex.colorSpace = THREE.SRGBColorSpace;
    railTex.anisotropy = maxAnisotropy;
    registerDisposable(railTex);

    const railGeo = new THREE.BoxGeometry(9.6, 0.22, 0.65);
    const railMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: railTex,
      roughness: 0.35,
      metalness: 0.72,
    });
    const rail = new THREE.Mesh(railGeo, railMat);
    rail.position.set(0, 0.14, 0);
    rail.castShadow = true;
    rail.receiveShadow = true;
    scene.add(rail);
    registerDisposable(railGeo);
    registerDisposable(railMat);

    // Rail End Feet (2 parts)
    const footMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.85,
      metalness: 0.15,
    });
    const footGeo = new THREE.BoxGeometry(0.35, 0.08, 0.9);
    const footL = new THREE.Mesh(footGeo, footMat);
    footL.position.set(-4.5, 0.04, 0);
    const footR = new THREE.Mesh(footGeo, footMat);
    footR.position.set(4.5, 0.04, 0);
    scene.add(footL, footR);
    registerDisposable(footMat);
    registerDisposable(footGeo);

    const brassMat = new THREE.MeshPhysicalMaterial({
      color: 0xd9a441,
      roughness: 0.24,
      metalness: 0.88,
      anisotropy: 0.6,
    });
    const saddleMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.68,
      metalness: 0.3,
    });
    registerDisposable(brassMat);
    registerDisposable(saddleMat);

    const saddleGeo = new THREE.BoxGeometry(0.45, 0.2, 0.74);
    const stemGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.72, 14);
    registerDisposable(saddleGeo);
    registerDisposable(stemGeo);

    // 1. Center Biconvex Lens Assembly
    const lensGroup = new THREE.Group();
    const lensSaddle = new THREE.Mesh(saddleGeo, saddleMat);
    lensSaddle.position.y = 0.34;
    const lensStem = new THREE.Mesh(stemGeo, brassMat);
    lensStem.position.y = 0.78;
    const bezelGeo = new THREE.TorusGeometry(0.68, 0.05, 14, 36);
    bezelGeo.rotateY(Math.PI / 2);
    const bezel = new THREE.Mesh(bezelGeo, brassMat);
    bezel.position.y = 1.68;

    const glassGeo = new THREE.SphereGeometry(0.66, 28, 24);
    glassGeo.scale(0.22, 1, 1);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xa5f3fc,
      roughness: 0.06,
      metalness: 0.0,
      transmission: isSoftwareGl ? 0 : 0.92,
      transparent: true,
      opacity: isSoftwareGl ? 0.42 : 1,
      ior: 1.52,
      thickness: 0.6,
      clearcoat: 1.0,
      depthWrite: false,
    });
    const glassLens = new THREE.Mesh(glassGeo, glassMat);
    glassLens.position.y = 1.68;
    glassLens.renderOrder = 2;

    lensGroup.add(lensSaddle, lensStem, bezel, glassLens);
    scene.add(lensGroup);
    registerDisposable(bezelGeo);
    registerDisposable(glassGeo);
    registerDisposable(glassMat);

    // 2. Object Emitter Group (moves along -X)
    const objGroup = new THREE.Group();
    const objSaddle = new THREE.Mesh(saddleGeo, saddleMat);
    objSaddle.position.y = 0.34;
    const objStem = new THREE.Mesh(stemGeo, brassMat);
    objStem.position.y = 0.78;
    const lampHousingGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.45, 18);
    lampHousingGeo.rotateZ(Math.PI / 2);
    const lampHousing = new THREE.Mesh(lampHousingGeo, saddleMat);
    lampHousing.position.set(-0.22, 1.45, 0);
    const arrowShaftGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.46, 10);
    const arrowMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.95,
      roughness: 0.3,
    });
    const arrowShaft = new THREE.Mesh(arrowShaftGeo, arrowMat);
    arrowShaft.position.set(0, 1.9, 0);
    const arrowTipGeo = new THREE.ConeGeometry(0.08, 0.16, 12);
    const arrowTip = new THREE.Mesh(arrowTipGeo, arrowMat);
    arrowTip.position.set(0, 2.18, 0);

    objGroup.add(objSaddle, objStem, lampHousing, arrowShaft, arrowTip);
    scene.add(objGroup);
    registerDisposable(lampHousingGeo);
    registerDisposable(arrowShaftGeo);
    registerDisposable(arrowMat);
    registerDisposable(arrowTipGeo);

    // 3. Projection Screen Assembly (moves along +X)
    const scrGroup = new THREE.Group();
    const scrSaddle = new THREE.Mesh(saddleGeo, saddleMat);
    scrSaddle.position.y = 0.34;
    const scrStem = new THREE.Mesh(stemGeo, brassMat);
    scrStem.position.y = 0.78;
    const boardGeo = new THREE.BoxGeometry(0.08, 1.4, 1.15);
    const boardMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.88,
      metalness: 0.05,
    });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.y = 1.68;

    const imgArrowMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.85,
      roughness: 0.3,
    });
    const imgArrowPivot = new THREE.Group();
    imgArrowPivot.position.set(-0.055, 1.68, 0);
    const imgShaft = new THREE.Mesh(arrowShaftGeo, imgArrowMat);
    imgShaft.position.y = 0.22;
    const imgTip = new THREE.Mesh(arrowTipGeo, imgArrowMat);
    imgTip.position.y = 0.5;
    imgArrowPivot.add(imgShaft, imgTip);

    scrGroup.add(scrSaddle, scrStem, board, imgArrowPivot);
    scene.add(scrGroup);
    registerDisposable(boardGeo);
    registerDisposable(boardMat);
    registerDisposable(imgArrowMat);

    // 4. Focal Point Markers (F1, F2)
    const fMarkerGeo = new THREE.OctahedronGeometry(0.08, 0);
    const fMarkerMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      emissiveIntensity: 0.7,
      roughness: 0.3,
    });
    const f1Mesh = new THREE.Mesh(fMarkerGeo, fMarkerMat);
    const f2Mesh = new THREE.Mesh(fMarkerGeo, fMarkerMat);
    scene.add(f1Mesh, f2Mesh);
    registerDisposable(fMarkerGeo);
    registerDisposable(fMarkerMat);

    // 5. Three Principal Light Ray Cylinders (repositioned without allocation)
    const rayGeo = new THREE.CylinderGeometry(0.015, 0.015, 1, 8);
    const rayMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const rayMat2 = new THREE.MeshBasicMaterial({ color: 0xfde047 });
    const raySegs = [
      new THREE.Mesh(rayGeo, rayMat2), // Parallel to lens
      new THREE.Mesh(rayGeo, rayMat),  // Lens through F2 to image
      new THREE.Mesh(rayGeo, rayMat2), // Straight through optical center
    ];
    scene.add(...raySegs);
    registerDisposable(rayGeo);
    registerDisposable(rayMat);
    registerDisposable(rayMat2);

    const alignRay = (
      mesh: THREE.Mesh,
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ) => {
      _vecA.set(x1, y1, 0);
      _vecB.set(x2, y2, 0);
      const len = _vecA.distanceTo(_vecB);
      mesh.position.copy(_vecA).lerp(_vecB, 0.5);
      mesh.scale.set(1, Math.max(0.01, len), 1);
      _vecB.sub(_vecA).normalize();
      _quatA.setFromUnitVectors(_up, _vecB);
      mesh.quaternion.copy(_quatA);
    };

    let currentObjX = -stateRef.current.objectDistCm * CM_SCALE;
    let currentScrX = 2.5;

    return {
      onFrame: (dt: number) => {
        const st = stateRef.current;
        const res = computeThinLensImage(st.objectDistCm, st.focalLengthCm);
        const targetObjX = -st.objectDistCm * CM_SCALE;
        const clampedImgCm = res.isReal
          ? Math.min(52, Math.max(6, res.imageDistCm))
          : 44;
        const targetScrX = clampedImgCm * CM_SCALE;

        const alpha = dt > 0 ? 1 - Math.exp(-10 * dt) : 1;
        currentObjX += (targetObjX - currentObjX) * alpha;
        currentScrX += (targetScrX - currentScrX) * alpha;

        objGroup.position.x = currentObjX;
        scrGroup.position.x = currentScrX;

        const fx = st.focalLengthCm * CM_SCALE;
        f1Mesh.position.set(-fx, 1.68, 0);
        f2Mesh.position.set(fx, 1.68, 0);

        const objTopY = 2.22;
        const axisY = 1.68;
        const tipOffset = (objTopY - axisY) * Math.min(2.2, res.magnification);
        const imgTipY = res.isReal ? axisY - tipOffset : axisY + tipOffset;

        imgArrowPivot.rotation.z = res.isInverted ? Math.PI : 0;
        imgArrowPivot.scale.setScalar(Math.max(0.35, Math.min(1.6, res.magnification)));

        alignRay(raySegs[0], currentObjX, objTopY, 0, objTopY);
        alignRay(raySegs[1], 0, objTopY, currentScrX, imgTipY);
        alignRay(raySegs[2], currentObjX, objTopY, currentScrX, imgTipY);

        return (
          Math.abs(targetObjX - currentObjX) > 0.005 ||
          Math.abs(targetScrX - currentScrX) > 0.005
        );
      },
    };
  };

  return (
    <ThreeLabViewport
      testId="optics-3d"
      title="Thin Convex Lens Optical Bench"
      badgeText="Three.js Physical Optics"
      readoutText={`v = ${lensResult.imageDistCm === 999 ? '∞' : `${lensResult.imageDistCm} cm`}  ·  M = ${lensResult.magnification.toFixed(2)}×  ·  ${lensResult.nature}`}
      presets={OPTICS_PRESETS}
      isAnimating={false}
      renderTrigger={objectDistCm * 100 + focalLengthCm}
      onBuildScene={handleBuildScene}
    >
      <label className="flex items-center gap-2 text-xs text-slate-200 tabular-nums">
        <span>Object u = {objectDistCm} cm</span>
        <input
          type="range"
          aria-label="Object Distance u"
          min={8}
          max={48}
          step={1}
          value={objectDistCm}
          onChange={(e) => setObjectDistCm(Number(e.target.value))}
          className="w-28 accent-amber-400"
        />
      </label>

      <label className="flex items-center gap-2 text-xs text-slate-200 tabular-nums">
        <span>Focal Length f = {focalLengthCm} cm</span>
        <input
          type="range"
          aria-label="Focal Length f"
          min={8}
          max={22}
          step={1}
          value={focalLengthCm}
          onChange={(e) => setFocalLengthCm(Number(e.target.value))}
          className="w-28 accent-cyan-400"
        />
      </label>
    </ThreeLabViewport>
  );
};

// =============================================================================
// 4. 3D MICROMETER SCREW GAUGE METROLOGY LAB
// =============================================================================
const MICROMETER_PRESETS: CameraPreset[] = [
  { id: 'front', label: 'Scale Read', position: [0.6, 1.85, 5.2], target: [0.3, 1.3, 0] },
  { id: 'iso', label: '3/4 Jaw View', position: [-3.4, 2.5, 4.4], target: [-0.2, 1.35, 0] },
  { id: 'thimble', label: 'Thimble Close', position: [2.4, 1.75, 2.7], target: [1.3, 1.45, 0] },
];

export const Micrometer3DSim: React.FC = () => {
  const [diameterMm, setDiameterMm] = useState(6.28);
  const [zeroErrorMm, setZeroErrorMm] = useState(0);

  const reading = useMemo(
    () => computeMicrometerReading(diameterMm, zeroErrorMm),
    [diameterMm, zeroErrorMm]
  );

  const stateRef = useRef({ diameterMm, zeroErrorMm });
  useEffect(() => {
    stateRef.current = { diameterMm, zeroErrorMm };
  }, [diameterMm, zeroErrorMm]);

  const handleBuildScene = (ctx: ThreeSceneContext) => {
    const { scene, registerDisposable, maxAnisotropy } = ctx;

    // Bench & Contact Shadow
    const benchTex = createBenchGridTexture('#38bdf8');
    benchTex.anisotropy = maxAnisotropy;
    registerDisposable(benchTex);

    const benchGeo = new THREE.BoxGeometry(10, 0.2, 6);
    const benchMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: benchTex,
      roughness: 0.84,
      metalness: 0.1,
    });
    const bench = new THREE.Mesh(benchGeo, benchMat);
    bench.position.y = -0.1;
    bench.receiveShadow = true;
    scene.add(bench);
    registerDisposable(benchGeo);
    registerDisposable(benchMat);

    const shadowTex = createRadialContactShadowTexture();
    registerDisposable(shadowTex);
    const shadowGeo = new THREE.CircleGeometry(2.1, 24);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0.2, 0.015, 0);
    scene.add(shadow);
    registerDisposable(shadowGeo);
    registerDisposable(shadowMat);

    // Composite Micrometer Apparatus Group (8 parts)
    const gauge = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x0f766e,
      roughness: 0.62,
      metalness: 0.25,
    });
    const chromeMat = new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      roughness: 0.14,
      metalness: 0.94,
      anisotropy: 0.75,
    });
    const brassMat = new THREE.MeshPhysicalMaterial({
      color: 0xd97706,
      roughness: 0.26,
      metalness: 0.88,
    });
    const darkStandMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
      metalness: 0.25,
    });
    registerDisposable(frameMat);
    registerDisposable(chromeMat);
    registerDisposable(brassMat);
    registerDisposable(darkStandMat);

    // Part 1: Pedestal Stand Block
    const standGeo = new THREE.BoxGeometry(1.5, 0.32, 0.95);
    const standMesh = new THREE.Mesh(standGeo, darkStandMat);
    standMesh.position.set(-0.6, 0.16, 0);
    standMesh.castShadow = true;
    gauge.add(standMesh);
    registerDisposable(standGeo);

    // Part 2: Curved Powder-Coated C-Frame via ExtrudeGeometry
    const cShape = new THREE.Shape();
    cShape.moveTo(-1.85, 1.55);
    cShape.absarc(-0.9, 1.15, 1.05, Math.PI * 0.82, Math.PI * 2.02, false);
    cShape.lineTo(0.32, 1.38);
    cShape.lineTo(0.05, 1.38);
    cShape.absarc(-0.9, 1.18, 0.72, Math.PI * 1.98, Math.PI * 0.85, true);
    cShape.closePath();

    const frameGeo = new THREE.ExtrudeGeometry(cShape, {
      depth: 0.24,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.03,
      bevelSegments: 3,
      curveSegments: 28,
    });
    frameGeo.translate(0, 0, -0.12);
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.castShadow = true;
    gauge.add(frameMesh);
    registerDisposable(frameGeo);

    // Part 3: Fixed Carbide Anvil
    const anvilGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.34, 18);
    anvilGeo.rotateZ(Math.PI / 2);
    const anvilMesh = new THREE.Mesh(anvilGeo, chromeMat);
    anvilMesh.position.set(-1.62, 1.48, 0);
    gauge.add(anvilMesh);
    registerDisposable(anvilGeo);

    // Part 4: Brass Specimen Cylinder clamped against anvil
    const specimenGeo = new THREE.CylinderGeometry(0.24, 0.24, 1, 20);
    specimenGeo.rotateZ(Math.PI / 2);
    const specimenMesh = new THREE.Mesh(specimenGeo, brassMat);
    specimenMesh.castShadow = true;
    gauge.add(specimenMesh);
    registerDisposable(specimenGeo);

    // Part 5: Engraved Millimeter Sleeve Barrel
    const sleeveCanvas = document.createElement('canvas');
    sleeveCanvas.width = 512;
    sleeveCanvas.height = 256;
    const sc = sleeveCanvas.getContext('2d');
    if (sc) {
      sc.fillStyle = '#cbd5e1';
      sc.fillRect(0, 0, 512, 256);
      sc.strokeStyle = '#0f172a';
      sc.lineWidth = 3;
      sc.beginPath();
      sc.moveTo(20, 128);
      sc.lineTo(492, 128);
      sc.stroke();

      sc.fillStyle = '#0f172a';
      sc.font = 'bold 20px monospace';
      for (let mm = 0; mm <= 20; mm++) {
        const x = 34 + mm * 22;
        sc.fillRect(x, 96, 2.5, 32);
        if (mm % 5 === 0) sc.fillText(String(mm), x - 6, 86);
        if (mm < 20) sc.fillRect(x + 11, 128, 2, 22);
      }
    }
    const sleeveTex = new THREE.CanvasTexture(sleeveCanvas);
    sleeveTex.colorSpace = THREE.SRGBColorSpace;
    sleeveTex.anisotropy = maxAnisotropy;
    registerDisposable(sleeveTex);

    const sleeveGeo = new THREE.CylinderGeometry(0.21, 0.21, 1.65, 24);
    sleeveGeo.rotateZ(-Math.PI / 2);
    const sleeveMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: sleeveTex,
      roughness: 0.28,
      metalness: 0.72,
    });
    const sleeveMesh = new THREE.Mesh(sleeveGeo, sleeveMat);
    sleeveMesh.position.set(1.05, 1.48, 0);
    sleeveMesh.rotation.x = Math.PI * 0.48;
    gauge.add(sleeveMesh);
    registerDisposable(sleeveGeo);
    registerDisposable(sleeveMat);

    // Part 6: Sliding Spindle
    const spindleGeo = new THREE.CylinderGeometry(0.105, 0.105, 1.8, 18);
    spindleGeo.rotateZ(Math.PI / 2);
    const spindleMesh = new THREE.Mesh(spindleGeo, chromeMat);
    spindleMesh.castShadow = true;
    gauge.add(spindleMesh);
    registerDisposable(spindleGeo);

    // Part 7 & 8: Rotating Thimble + Ratchet Stop Assembly
    const thimbleCanvas = document.createElement('canvas');
    thimbleCanvas.width = 512;
    thimbleCanvas.height = 256;
    const tc = thimbleCanvas.getContext('2d');
    if (tc) {
      tc.fillStyle = '#e2e8f0';
      tc.fillRect(0, 0, 512, 256);
      tc.fillStyle = '#0f172a';
      tc.font = 'bold 18px monospace';
      for (let div = 0; div < 50; div++) {
        const y = (div / 50) * 256;
        const w = div % 5 === 0 ? 74 : 44;
        tc.fillRect(0, y, w, 2.5);
        if (div % 5 === 0) tc.fillText(String(div), 82, y + 6);
      }
      // Knurled grip band
      tc.fillStyle = '#475569';
      tc.fillRect(260, 0, 252, 256);
      tc.strokeStyle = '#94a3b8';
      tc.lineWidth = 2;
      for (let y = 0; y < 256; y += 10) {
        tc.beginPath();
        tc.moveTo(260, y);
        tc.lineTo(512, y);
        tc.stroke();
      }
    }
    const thimbleTex = new THREE.CanvasTexture(thimbleCanvas);
    thimbleTex.colorSpace = THREE.SRGBColorSpace;
    thimbleTex.anisotropy = maxAnisotropy;
    registerDisposable(thimbleTex);

    const thimbleGroup = new THREE.Group();
    thimbleGroup.position.set(1.2, 1.48, 0);
    const thimbleGeo = new THREE.CylinderGeometry(0.28, 0.25, 1.05, 28);
    thimbleGeo.rotateZ(-Math.PI / 2);
    const thimbleMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: thimbleTex,
      roughness: 0.35,
      metalness: 0.78,
    });
    const thimbleMesh = new THREE.Mesh(thimbleGeo, thimbleMat);
    thimbleGroup.add(thimbleMesh);

    const ratchetGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.36, 18);
    ratchetGeo.rotateZ(-Math.PI / 2);
    const ratchetMesh = new THREE.Mesh(ratchetGeo, brassMat);
    ratchetMesh.position.x = 0.7;
    thimbleGroup.add(ratchetMesh);

    gauge.add(thimbleGroup);
    registerDisposable(thimbleGeo);
    registerDisposable(thimbleMat);
    registerDisposable(ratchetGeo);

    scene.add(gauge);

    let currentDiam = stateRef.current.diameterMm;

    return {
      onFrame: (dt: number) => {
        const st = stateRef.current;
        const alpha = dt > 0 ? 1 - Math.exp(-10 * dt) : 1;
        currentDiam += (st.diameterMm - currentDiam) * alpha;

        const gapWorld = Math.max(0.08, currentDiam * 0.07);
        const anvilFaceX = -1.45;
        specimenMesh.scale.set(gapWorld, 1, 1);
        specimenMesh.position.set(anvilFaceX + gapWorld / 2, 1.48, 0);

        const spindleFaceX = anvilFaceX + gapWorld;
        spindleMesh.position.set(spindleFaceX + 0.9, 1.48, 0);
        thimbleGroup.position.x = 0.9 + currentDiam * 0.065;
        thimbleGroup.rotation.x = ((currentDiam + st.zeroErrorMm) / 0.5) * Math.PI * 2;

        return Math.abs(st.diameterMm - currentDiam) > 0.004;
      },
    };
  };

  return (
    <ThreeLabViewport
      testId="micrometer-3d"
      title="Micrometer Screw Gauge (0.01 mm)"
      badgeText="Three.js Metrology"
      readoutText={`Sleeve = ${reading.sleeveReadingMm.toFixed(1)} mm  ·  Thimble = ${reading.thimbleDivisions} div  ·  Corrected d = ${reading.correctedDiameterMm.toFixed(2)} mm`}
      presets={MICROMETER_PRESETS}
      isAnimating={false}
      renderTrigger={Math.round(diameterMm * 100 + zeroErrorMm * 1000)}
      onBuildScene={handleBuildScene}
    >
      <label className="flex items-center gap-2 text-xs text-slate-200 tabular-nums">
        <span>Specimen Ø = {diameterMm.toFixed(2)} mm</span>
        <input
          type="range"
          aria-label="Specimen Diameter"
          min={1.0}
          max={18.0}
          step={0.01}
          value={diameterMm}
          onChange={(e) => setDiameterMm(Number(e.target.value))}
          className="w-36 accent-cyan-400"
        />
      </label>

      <label className="flex items-center gap-2 text-xs text-slate-200 tabular-nums">
        <span>Zero Error = {zeroErrorMm >= 0 ? `+${zeroErrorMm.toFixed(2)}` : zeroErrorMm.toFixed(2)} mm</span>
        <input
          type="range"
          aria-label="Zero Error"
          min={-0.1}
          max={0.1}
          step={0.01}
          value={zeroErrorMm}
          onChange={(e) => setZeroErrorMm(Number(e.target.value))}
          className="w-24 accent-amber-400"
        />
      </label>
    </ThreeLabViewport>
  );
};
