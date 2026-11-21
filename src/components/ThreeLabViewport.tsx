import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, Maximize2, Minimize2, RotateCcw } from 'lucide-react';

export interface CameraPreset {
  id: string;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}

export interface ThreeSceneContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  isSoftwareGl: boolean;
  maxAnisotropy: number;
  registerDisposable: (item: THREE.BufferGeometry | THREE.Material | THREE.Texture) => void;
  requestRender: () => void;
}

export interface ThreeSceneController {
  onFrame?: (dt: number, elapsed: number) => boolean | void; // return true if scene still animating
  dispose?: () => void;
}

interface ThreeLabViewportProps {
  testId: string;
  title: string;
  badgeText: string;
  readoutText: string;
  presets: CameraPreset[];
  isAnimating?: boolean;
  renderTrigger?: number;
  onBuildScene: (ctx: ThreeSceneContext) => ThreeSceneController;
  children: React.ReactNode; // Bottom control dock contents
}

const _desiredPos = new THREE.Vector3();
const _desiredTarget = new THREE.Vector3();

function detectSoftwareGl(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function createRadialContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(
      size / 2,
      size / 2,
      size * 0.05,
      size / 2,
      size / 2,
      size * 0.5
    );
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.28)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const ThreeLabViewport: React.FC<ThreeLabViewportProps> = ({
  testId,
  title,
  badgeText,
  readoutText,
  presets,
  isAnimating = true,
  renderTrigger = 0,
  onBuildScene,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);

  const [controlsCollapsed, setControlsCollapsed] = useState(false);
  const [isCinemaFullscreen, setIsCinemaFullscreen] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string>(presets[0]?.id ?? 'default');

  const isAnimatingRef = useRef(isAnimating);
  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  const onBuildSceneRef = useRef(onBuildScene);
  onBuildSceneRef.current = onBuildScene;

  const cameraPresetTargetRef = useRef<{
    active: boolean;
    position: [number, number, number];
    target: [number, number, number];
  }>({
    active: false,
    position: presets[0]?.position ?? [6, 4, 8],
    target: presets[0]?.target ?? [0, 1, 0],
  });

  const requestRenderRef = useRef<() => void>(() => {});
  const startLoopRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (isAnimating) {
      startLoopRef.current();
    } else {
      requestRenderRef.current();
    }
  }, [isAnimating]);

  useEffect(() => {
    if (!isAnimatingRef.current) {
      requestRenderRef.current();
    }
  }, [renderTrigger]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'h' || e.key === 'H') {
        setControlsCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    const isSoftwareGl = detectSoftwareGl();
    const width = Math.max(320, mount.clientWidth || 720);
    const height = Math.max(260, mount.clientHeight || 420);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.setAttribute('data-testid', `${testId}-canvas`);
    mount.replaceChildren(canvas);

    const scene = new THREE.Scene();
    const bgHex = 0x070b14;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.022);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 160);
    const initialPreset = presets[0] ?? {
      id: 'default',
      label: 'Perspective',
      position: [6, 4, 8] as [number, number, number],
      target: [0, 1, 0] as [number, number, number],
    };
    camera.position.set(...initialPreset.position);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(...initialPreset.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.minDistance = 2.2;
    controls.maxDistance = 32;
    controls.update();

    // Studio warm/cool 3-point lighting rig
    const hemiLight = new THREE.HemisphereLight(0x9ec5ff, 0x162033, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1d6, 2.25);
    keyLight.position.set(7, 11, 6);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 32;
    keyLight.shadow.camera.left = -10;
    keyLight.shadow.camera.right = 10;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -10;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.85);
    rimLight.position.set(-7, 5, -6);
    scene.add(rimLight);

    const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [envTex];
    const registerDisposable = (item: THREE.BufferGeometry | THREE.Material | THREE.Texture) => {
      disposables.push(item);
    };

    let frameId = 0;
    let timeoutId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let disposed = false;
    let loopRunning = false;
    let elapsed = 0;

    const afterDraw = (cb: () => void) => {
      if (disposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        timeoutId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
        if (state === gl.UNSIGNALED) {
          timeoutId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          timeoutId = window.setTimeout(cb, 80);
        }
      };
      timeoutId = window.setTimeout(poll, 5);
    };

    const advanceCameraTransition = (dt: number): boolean => {
      const preset = cameraPresetTargetRef.current;
      if (!preset.active) return false;
      const alpha = 1 - Math.exp(-7 * dt);
      _desiredPos.set(...preset.position);
      _desiredTarget.set(...preset.target);
      camera.position.lerp(_desiredPos, alpha);
      controls.target.lerp(_desiredTarget, alpha);
      if (
        camera.position.distanceToSquared(_desiredPos) < 0.0008 &&
        controls.target.distanceToSquared(_desiredTarget) < 0.0008
      ) {
        camera.position.copy(_desiredPos);
        controls.target.copy(_desiredTarget);
        preset.active = false;
        return false;
      }
      return true;
    };

    const requestRender = () => {
      if (disposed || loopRunning) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = window.requestAnimationFrame(() => {
        if (disposed) return;
        renderDirty = false;
        const movingCam = advanceCameraTransition(1 / 60);
        controls.update();
        const ctrlAnimating = Boolean(controller.onFrame?.(1 / 60, elapsed));
        renderer.render(scene, camera);
        const done = () => {
          renderBusy = false;
          if (!disposed && (renderDirty || movingCam || ctrlAnimating)) {
            requestRender();
          }
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    };
    requestRenderRef.current = requestRender;

    const controller = onBuildSceneRef.current({
      scene,
      camera,
      renderer,
      isSoftwareGl,
      maxAnisotropy: renderer.capabilities.getMaxAnisotropy(),
      registerDisposable,
      requestRender,
    });

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let lastTime = performance.now();

    const tick = () => {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      elapsed += dt;

      const movingCam = advanceCameraTransition(dt);
      controls.update();
      const ctrlStillActive = controller.onFrame?.(dt, elapsed);
      renderer.render(scene, camera);

      const keepLooping = isAnimatingRef.current || movingCam || Boolean(ctrlStillActive);
      if (keepLooping) {
        if (isSoftwareGl) afterDraw(tick);
        else frameId = window.requestAnimationFrame(tick);
      } else {
        loopRunning = false;
      }
    };

    const startLoop = () => {
      if (disposed || loopRunning) return;
      loopRunning = true;
      lastTime = performance.now();
      if (isSoftwareGl) afterDraw(tick);
      else frameId = window.requestAnimationFrame(tick);
    };
    startLoopRef.current = startLoop;

    const handleControlsStart = () => {
      cameraPresetTargetRef.current.active = false;
    };
    const handleControlsChange = () => {
      if (!loopRunning) requestRender();
    };
    controls.addEventListener('start', handleControlsStart);
    controls.addEventListener('change', handleControlsChange);

    let resizeRaf = 0;
    let lastObservedW = width;
    let lastObservedH = height;
    const resizeObserver = new ResizeObserver((entries) => {
      if (disposed) return;
      const entry = entries[0];
      if (!entry) return;
      const nextW = Math.max(320, Math.floor(entry.contentRect.width));
      const nextH = Math.max(260, Math.floor(entry.contentRect.height));
      if (nextW === lastObservedW && nextH === lastObservedH) return;
      lastObservedW = nextW;
      lastObservedH = nextH;
      if (resizeRaf) window.cancelAnimationFrame(resizeRaf);
      resizeRaf = window.requestAnimationFrame(() => {
        resizeRaf = 0;
        if (disposed) return;
        camera.aspect = nextW / nextH;
        camera.updateProjectionMatrix();
        renderer.setSize(nextW, nextH, false);
        requestRender();
      });
    });
    resizeObserver.observe(mount);

    // First paint with synchronous frame-0 pose + start continuous or on-demand loop
    controller.onFrame?.(0, 0);
    renderer.render(scene, camera);
    if (isAnimatingRef.current) {
      startLoop();
    }

    return () => {
      disposed = true;
      loopRunning = false;
      window.cancelAnimationFrame(frameId);
      if (resizeRaf) window.cancelAnimationFrame(resizeRaf);
      window.clearTimeout(timeoutId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', handleControlsStart);
      controls.removeEventListener('change', handleControlsChange);
      controls.dispose();
      controller.dispose?.();
      for (const item of disposables) {
        item.dispose();
      }
      renderer.dispose();
      mount.replaceChildren();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId]);

  const handleSelectPreset = (preset: CameraPreset) => {
    setActivePresetId(preset.id);
    cameraPresetTargetRef.current = {
      active: true,
      position: preset.position,
      target: preset.target,
    };
    if (isAnimatingRef.current) {
      startLoopRef.current();
    } else {
      requestRenderRef.current();
    }
  };

  const handleResetView = () => {
    if (presets[0]) handleSelectPreset(presets[0]);
  };

  return (
    <div
      ref={containerRef}
      data-testid={`${testId}-viewport`}
      className={
        isCinemaFullscreen
          ? 'fixed inset-0 z-50 bg-[#070b14] flex flex-col'
          : 'relative w-full h-[390px] sm:h-[430px] rounded-xl overflow-hidden border border-slate-800 bg-[#070b14]'
      }
    >
      {/* Dedicated empty mount container outside sibling HUD overlays */}
      <div ref={canvasMountRef} className="w-full h-full" />

      {/* Top-Left Minimal Spec & Live Readout Badge (solid/rgba surface, zero backdrop-filter) */}
      <div
        className="pointer-events-none absolute top-3.5 left-3.5 max-w-[82%] rounded-xl px-3.5 py-2 border border-slate-700/70"
        style={{ backgroundColor: 'rgba(9, 13, 22, 0.88)' }}
      >
        <div className="flex items-center gap-2 text-[11px] font-semibold text-cyan-300">
          <span>{badgeText}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">{title}</span>
        </div>
        <div className="text-xs font-mono text-slate-100 mt-0.5 tabular-nums">{readoutText}</div>
      </div>

      {/* Top-Right Compact View Utility Icons */}
      <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleResetView}
          aria-label="Reset 3D camera"
          className="p-2 rounded-lg border border-slate-700/80 text-slate-200 hover:text-white transition-colors"
          style={{ backgroundColor: 'rgba(9, 13, 22, 0.88)' }}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setIsCinemaFullscreen((v) => !v)}
          aria-label={isCinemaFullscreen ? 'Exit fullscreen 3D lab' : 'Expand 3D lab fullscreen'}
          className="p-2 rounded-lg border border-slate-700/80 text-slate-200 hover:text-white transition-colors"
          style={{ backgroundColor: 'rgba(9, 13, 22, 0.88)' }}
        >
          {isCinemaFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Collapsible Unified Bottom Control Dock (Zero Viewport Center Occlusion, No backdrop-filter) */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 w-[min(860px,95%)] flex flex-col items-center">
        <button
          type="button"
          onClick={() => setControlsCollapsed((v) => !v)}
          aria-expanded={!controlsCollapsed}
          className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-t-lg border border-b-0 border-slate-700/80 text-[11px] font-semibold text-slate-200 hover:text-white transition-colors"
          style={{ backgroundColor: 'rgba(9, 13, 22, 0.94)' }}
        >
          {controlsCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Show Controls (H)</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>Hide Controls (H)</span>
            </>
          )}
        </button>

        {!controlsCollapsed && (
          <div
            className="pointer-events-auto w-full rounded-xl rounded-t-lg border border-slate-700/80 px-3.5 py-2.5 shadow-xl"
            style={{ backgroundColor: 'rgba(9, 13, 22, 0.93)' }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              {/* Interactive Simulator Controls */}
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[240px]">{children}</div>

              {/* Camera Presets */}
              <div className="flex items-center gap-1 border-l border-slate-800 pl-2.5">
                {presets.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      activePresetId === p.id
                        ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white border border-transparent'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
