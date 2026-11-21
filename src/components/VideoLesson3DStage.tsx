import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Box, RotateCcw } from 'lucide-react';
import type { Video3DVisualKind } from '../utils/noteVideo';

interface VideoLesson3DStageProps {
  visual3DKind: Video3DVisualKind;
  sceneTitle: string;
  accentHex: string;
  isPlaying: boolean;
  syncProgress: number;
  sceneIdx: number;
}

const VISUAL_3D_LABELS: Record<Video3DVisualKind, { title: string; hint: string }> = {
  'atom-orbitals': {
    title: '3D Atomic Nucleus & Quantized Shells',
    hint: 'Nucleus protons/neutrons + quantized electron orbitals',
  },
  'mechanics-projectile': {
    title: '3D Kinematic Trajectory & Vector Model',
    hint: 'Parabolic path separating horizontal & vertical motion',
  },
  'waves-optics': {
    title: '3D Optical Prism, Rays & Transverse Wave',
    hint: 'Refraction/TIR path + transverse oscillation envelope',
  },
  'circuits-em': {
    title: '3D Electromagnetic Induction & Circuit Flux',
    hint: 'Laminated core, primary/secondary coils & flux loop',
  },
  'geometry-solids': {
    title: '3D Mensuration Solids & Vector Triad',
    hint: 'Concentric cone/sphere geometry & coordinate axes',
  },
  'calculus-surface': {
    title: '3D Volume of Revolution & Riemann Slices',
    hint: 'Disk integration V = π∫y²dx & tangent slope needle',
  },
  'chemistry-molecules': {
    title: '3D Molecular Geometry & Volumetric Flask',
    hint: 'Tetrahedral bond lattice + lathe reagent vessel',
  },
  'biology-cell-organ': {
    title: '3D Double Helix DNA & Cellular Organelles',
    hint: 'Sugar-phosphate twin strands, base pairs & organelle core',
  },
  'ict-network-logic': {
    title: '3D CPU Core & Packet-Switched Mesh',
    hint: 'Central processor node routing live data packets',
  },
  'grammar-pillars': {
    title: '3D Sentence & Essay Architecture Pillars',
    hint: 'Foundational subject-verb-clause structural balance',
  },
  'governance-scale': {
    title: '3D Civic Equilibrium & Global Integration',
    hint: 'Balanced constitutional scale + orbital cooperation ring',
  },
};

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

function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, size * 0.05, size / 2, size / 2, size * 0.5);
    g.addColorStop(0, 'rgba(0,0,0,0.68)');
    g.addColorStop(0.55, 'rgba(0,0,0,0.22)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface BuiltModel {
  root: THREE.Group;
  disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[];
  animate: (elapsed: number, progress: number) => void;
}

function buildEducationalModel(kind: Video3DVisualKind, accentHex: string): BuiltModel {
  const root = new THREE.Group();
  const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];
  const track = <T extends THREE.BufferGeometry | THREE.Material | THREE.Texture>(item: T): T => {
    disposables.push(item);
    return item;
  };

  const accentColor = new THREE.Color(accentHex || '#22d3ee');
  const slateMat = track(
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.78, metalness: 0.25 })
  );
  const brushedSteelMat = track(
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.24, metalness: 0.85 })
  );
  const goldMat = track(
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.26, metalness: 0.86 })
  );
  const accentMat = track(
    new THREE.MeshStandardMaterial({
      color: accentColor,
      emissive: accentColor,
      emissiveIntensity: 0.28,
      roughness: 0.32,
      metalness: 0.45,
    })
  );
  const glassMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      roughness: 0.08,
      metalness: 0.05,
      transmission: 0.68,
      transparent: true,
      opacity: 0.82,
      ior: 1.48,
      thickness: 0.4,
    })
  );

  // Common precision turntable pedestal base (bottom at y = 0)
  const plinthGeo = track(new THREE.CylinderGeometry(2.3, 2.55, 0.18, 36));
  const plinth = new THREE.Mesh(plinthGeo, slateMat);
  plinth.position.y = 0.09;
  plinth.receiveShadow = true;
  root.add(plinth);

  const trimGeo = track(new THREE.TorusGeometry(2.32, 0.032, 12, 48));
  trimGeo.rotateX(Math.PI / 2);
  const trim = new THREE.Mesh(trimGeo, accentMat);
  trim.position.y = 0.18;
  root.add(trim);

  const stageGroup = new THREE.Group();
  stageGroup.position.y = 0.22;
  root.add(stageGroup);

  let animateFn: (elapsed: number, progress: number) => void = (elapsed) => {
    stageGroup.rotation.y = elapsed * 0.28;
  };

  if (kind === 'atom-orbitals') {
    const nucleusGroup = new THREE.Group();
    nucleusGroup.position.y = 1.65;
    const protonMat = track(
      new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.35, metalness: 0.25 })
    );
    const neutronMat = track(
      new THREE.MeshStandardMaterial({ color: 0x60a5fa, roughness: 0.65, metalness: 0.15 })
    );
    const nucSphereGeo = track(new THREE.SphereGeometry(0.18, 18, 18));
    const offsets: [number, number, number, boolean][] = [
      [0, 0, 0, true],
      [0.18, 0.08, 0.05, false],
      [-0.17, 0.06, -0.08, true],
      [0.05, -0.17, 0.12, false],
      [-0.08, -0.14, -0.15, true],
      [0.12, 0.16, -0.12, false],
      [-0.14, 0.15, 0.13, true],
    ];
    offsets.forEach(([ox, oy, oz, isProton]) => {
      const m = new THREE.Mesh(nucSphereGeo, isProton ? protonMat : neutronMat);
      m.position.set(ox, oy, oz);
      nucleusGroup.add(m);
    });
    stageGroup.add(nucleusGroup);

    const ringGeo = track(new THREE.TorusGeometry(1.45, 0.025, 12, 56));
    const electronGeo = track(new THREE.SphereGeometry(0.095, 16, 16));
    const eNodes: THREE.Group[] = [];
    const tilts: [number, number, number][] = [
      [Math.PI * 0.32, 0, 0.2],
      [-Math.PI * 0.32, 0.8, -0.35],
      [Math.PI * 0.45, -0.7, 0.7],
    ];
    tilts.forEach(([rx, ry, rz]) => {
      const orbitPivot = new THREE.Group();
      orbitPivot.position.y = 1.65;
      orbitPivot.rotation.set(rx, ry, rz);
      const ring = new THREE.Mesh(ringGeo, brushedSteelMat);
      orbitPivot.add(ring);

      const electron = new THREE.Mesh(electronGeo, goldMat);
      electron.position.set(1.45, 0, 0);
      orbitPivot.add(electron);

      stageGroup.add(orbitPivot);
      eNodes.push(orbitPivot);
    });

    animateFn = (elapsed, progress) => {
      nucleusGroup.rotation.y = elapsed * 0.8;
      eNodes.forEach((node, idx) => {
        node.rotation.z += 0.022 * (idx + 1);
        node.scale.setScalar(0.95 + 0.08 * Math.sin(progress * Math.PI * 2 + idx));
      });
      stageGroup.rotation.y = elapsed * 0.25;
    };
  } else if (kind === 'mechanics-projectile') {
    // Ground targets + Brass cannon + Glowing parabolic arc tube + animated projectile sphere
    const barrelPivot = new THREE.Group();
    barrelPivot.position.set(-1.55, 0.38, 0);
    const basePostGeo = track(new THREE.CylinderGeometry(0.16, 0.24, 0.38, 16));
    const basePost = new THREE.Mesh(basePostGeo, brushedSteelMat);
    basePost.position.set(-1.55, 0.19, 0);
    stageGroup.add(basePost);

    const lathePts = [
      new THREE.Vector2(0.02, -0.2),
      new THREE.Vector2(0.15, -0.2),
      new THREE.Vector2(0.11, 0.35),
      new THREE.Vector2(0.14, 0.65),
      new THREE.Vector2(0.09, 0.65),
    ];
    const barrelGeo = track(new THREE.LatheGeometry(lathePts, 20));
    barrelGeo.rotateZ(-Math.PI / 4);
    const barrel = new THREE.Mesh(barrelGeo, goldMat);
    barrelPivot.add(barrel);
    stageGroup.add(barrelPivot);

    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-1.35, 0.62, 0),
      new THREE.Vector3(0.15, 2.75, 0),
      new THREE.Vector3(1.65, 0.2, 0)
    );
    const arcGeo = track(new THREE.TubeGeometry(curve, 36, 0.03, 10, false));
    const arcMesh = new THREE.Mesh(arcGeo, accentMat);
    stageGroup.add(arcMesh);

    const ballGeo = track(new THREE.SphereGeometry(0.14, 18, 18));
    const ball = new THREE.Mesh(ballGeo, goldMat);
    stageGroup.add(ball);

    const ringTargetGeo = track(new THREE.CylinderGeometry(0.32, 0.36, 0.08, 24));
    const targetRing = new THREE.Mesh(ringTargetGeo, accentMat);
    targetRing.position.set(1.65, 0.04, 0);
    stageGroup.add(targetRing);

    animateFn = (elapsed, progress) => {
      const t = (elapsed * 0.45 + progress) % 1;
      const pt = curve.getPoint(t);
      ball.position.copy(pt);
      stageGroup.rotation.y = Math.sin(elapsed * 0.35) * 0.4;
    };
  } else if (kind === 'waves-optics') {
    // Triangular glass prism + incident & refracted light beam tubes + transverse wave array
    const prismShape = new THREE.Shape();
    prismShape.moveTo(0, 1.15);
    prismShape.lineTo(-0.95, -0.45);
    prismShape.lineTo(0.95, -0.45);
    prismShape.closePath();
    const prismGeo = track(
      new THREE.ExtrudeGeometry(prismShape, { depth: 0.75, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04 })
    );
    prismGeo.center();
    const prism = new THREE.Mesh(prismGeo, glassMat);
    prism.position.set(0, 1.15, 0);
    stageGroup.add(prism);

    const beamInGeo = track(
      new THREE.CylinderGeometry(0.032, 0.032, 1.8, 12)
    );
    beamInGeo.rotateZ(Math.PI / 2.4);
    const beamIn = new THREE.Mesh(beamInGeo, goldMat);
    beamIn.position.set(-1.35, 1.35, 0);
    stageGroup.add(beamIn);

    const rayColors = [0xf43f5e, 0xf59e0b, 0x22d3ee];
    rayColors.forEach((hex, idx) => {
      const mat = track(
        new THREE.MeshStandardMaterial({ color: hex, emissive: hex, emissiveIntensity: 0.4, roughness: 0.3 })
      );
      const outGeo = track(new THREE.CylinderGeometry(0.025, 0.025, 1.85, 10));
      outGeo.rotateZ(-Math.PI / 2.9 - idx * 0.11);
      const ray = new THREE.Mesh(outGeo, mat);
      ray.position.set(1.25, 1.12 - idx * 0.22, (idx - 1) * 0.08);
      stageGroup.add(ray);
    });

    // Transverse standing wave crests along base
    const beadGeo = track(new THREE.SphereGeometry(0.075, 12, 12));
    const beads: THREE.Mesh[] = [];
    for (let i = 0; i < 13; i++) {
      const b = new THREE.Mesh(beadGeo, accentMat);
      b.position.set(-1.8 + i * 0.3, 0.28, 1.05);
      stageGroup.add(b);
      beads.push(b);
    }

    animateFn = (elapsed, progress) => {
      prism.rotation.y = Math.sin(elapsed * 0.4) * 0.25;
      beads.forEach((b, i) => {
        b.position.y = 0.28 + Math.sin(elapsed * 3.5 + i * 0.6 + progress * Math.PI * 2) * 0.16;
      });
      stageGroup.rotation.y = elapsed * 0.24;
    };
  } else if (kind === 'circuits-em') {
    // Laminated soft-iron core frame + copper primary/secondary coil toruses + orbiting charge beads
    const copperMat = track(
      new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.28, metalness: 0.85 })
    );
    const barHGeo = track(new THREE.BoxGeometry(2.6, 0.28, 0.55));
    const barVGeo = track(new THREE.BoxGeometry(0.32, 1.65, 0.55));
    const botBar = new THREE.Mesh(barHGeo, brushedSteelMat);
    botBar.position.y = 0.22;
    const topBar = new THREE.Mesh(barHGeo, brushedSteelMat);
    topBar.position.y = 1.88;
    const leftBar = new THREE.Mesh(barVGeo, brushedSteelMat);
    leftBar.position.set(-1.14, 1.05, 0);
    const rightBar = new THREE.Mesh(barVGeo, brushedSteelMat);
    rightBar.position.set(1.14, 1.05, 0);
    stageGroup.add(botBar, topBar, leftBar, rightBar);

    const coilGeo = track(new THREE.TorusGeometry(0.38, 0.055, 12, 24));
    coilGeo.rotateX(Math.PI / 2);
    for (let i = 0; i < 5; i++) {
      const pCoil = new THREE.Mesh(coilGeo, copperMat);
      pCoil.position.set(-1.14, 0.55 + i * 0.24, 0);
      stageGroup.add(pCoil);
    }
    for (let i = 0; i < 8; i++) {
      const sCoil = new THREE.Mesh(coilGeo, goldMat);
      sCoil.position.set(1.14, 0.48 + i * 0.16, 0);
      stageGroup.add(sCoil);
    }

    const pulseGeo = track(new THREE.SphereGeometry(0.085, 12, 12));
    const pulseA = new THREE.Mesh(pulseGeo, accentMat);
    const pulseB = new THREE.Mesh(pulseGeo, accentMat);
    stageGroup.add(pulseA, pulseB);

    animateFn = (elapsed, progress) => {
      const theta = elapsed * 2.2 + progress * Math.PI * 2;
      pulseA.position.set(Math.cos(theta) * 1.14, 1.05 + Math.sin(theta) * 0.82, 0.34);
      pulseB.position.set(Math.cos(theta + Math.PI) * 1.14, 1.05 + Math.sin(theta + Math.PI) * 0.82, -0.34);
      stageGroup.rotation.y = elapsed * 0.26;
    };
  } else if (kind === 'calculus-surface') {
    // 3D Volume of Revolution lathe goblet + stacked Riemann disk slices
    const profilePts = [
      new THREE.Vector2(0.02, 0),
      new THREE.Vector2(1.35, 0.12),
      new THREE.Vector2(1.15, 0.6),
      new THREE.Vector2(0.75, 1.25),
      new THREE.Vector2(0.45, 1.85),
      new THREE.Vector2(0.02, 2.05),
    ];
    const revGeo = track(new THREE.LatheGeometry(profilePts, 32));
    const revMesh = new THREE.Mesh(revGeo, glassMat);
    revMesh.position.y = 0.25;
    stageGroup.add(revMesh);

    const disks: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const r = 1.22 - i * 0.19;
      const dGeo = track(new THREE.CylinderGeometry(r, r, 0.14, 28));
      const dMesh = new THREE.Mesh(dGeo, i % 2 === 0 ? accentMat : goldMat);
      dMesh.position.y = 0.36 + i * 0.32;
      stageGroup.add(dMesh);
      disks.push(dMesh);
    }

    const tangentGeo = track(new THREE.CylinderGeometry(0.028, 0.028, 2.2, 12));
    tangentGeo.rotateZ(Math.PI / 3);
    const tangentLine = new THREE.Mesh(tangentGeo, brushedSteelMat);
    tangentLine.position.set(0.7, 1.4, 0);
    stageGroup.add(tangentLine);

    animateFn = (elapsed, progress) => {
      disks.forEach((d, idx) => {
        const s = 0.96 + 0.07 * Math.sin(elapsed * 2 + idx * 0.7 + progress * Math.PI);
        d.scale.set(s, 1, s);
      });
      tangentLine.rotation.z = Math.sin(elapsed * 1.1) * 0.25;
      stageGroup.rotation.y = elapsed * 0.3;
    };
  } else if (kind === 'geometry-solids') {
    // Polyhedron + Cone + Sphere + Coordinate triad axes
    const coneGeo = track(new THREE.ConeGeometry(0.85, 1.65, 28));
    const cone = new THREE.Mesh(coneGeo, accentMat);
    cone.position.set(-0.75, 0.85, 0);
    stageGroup.add(cone);

    const sphereGeo = track(new THREE.SphereGeometry(0.62, 24, 24));
    const sphere = new THREE.Mesh(sphereGeo, goldMat);
    sphere.position.set(0.82, 0.65, 0.25);
    stageGroup.add(sphere);

    const icosaGeo = track(new THREE.IcosahedronGeometry(0.54, 0));
    const icosa = new THREE.Mesh(icosaGeo, glassMat);
    icosa.position.set(0.25, 1.75, -0.35);
    stageGroup.add(icosa);

    animateFn = (elapsed) => {
      icosa.rotation.y = elapsed * 0.9;
      icosa.rotation.x = elapsed * 0.45;
      stageGroup.rotation.y = elapsed * 0.28;
    };
  } else if (kind === 'chemistry-molecules') {
    // 3D Tetrahedral Methane-style molecule + Lathe Conical Flask
    const flaskPts = [
      new THREE.Vector2(0.01, 0),
      new THREE.Vector2(0.75, 0),
      new THREE.Vector2(0.82, 0.14),
      new THREE.Vector2(0.26, 1.15),
      new THREE.Vector2(0.26, 1.65),
      new THREE.Vector2(0.32, 1.7),
    ];
    const flaskGeo = track(new THREE.LatheGeometry(flaskPts, 28));
    const flask = new THREE.Mesh(flaskGeo, glassMat);
    flask.position.set(-0.92, 0.05, 0);
    stageGroup.add(flask);

    const liqGeo = track(new THREE.CylinderGeometry(0.28, 0.68, 0.62, 24));
    const liq = new THREE.Mesh(liqGeo, accentMat);
    liq.position.set(-0.92, 0.36, 0);
    stageGroup.add(liq);

    const molGroup = new THREE.Group();
    molGroup.position.set(0.75, 1.25, 0);
    const centerGeo = track(new THREE.SphereGeometry(0.32, 20, 20));
    const outerGeo = track(new THREE.SphereGeometry(0.18, 16, 16));
    const bondGeo = track(new THREE.CylinderGeometry(0.045, 0.045, 0.85, 10));

    molGroup.add(new THREE.Mesh(centerGeo, goldMat));
    const dirs: [number, number, number][] = [
      [0, 1, 0],
      [0.94, -0.33, 0],
      [-0.47, -0.33, 0.81],
      [-0.47, -0.33, -0.81],
    ];
    dirs.forEach(([dx, dy, dz]) => {
      const v = new THREE.Vector3(dx, dy, dz).normalize();
      const atom = new THREE.Mesh(outerGeo, accentMat);
      atom.position.copy(v).multiplyScalar(0.85);
      molGroup.add(atom);

      const bond = new THREE.Mesh(bondGeo, brushedSteelMat);
      bond.position.copy(v).multiplyScalar(0.42);
      bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v);
      molGroup.add(bond);
    });
    stageGroup.add(molGroup);

    animateFn = (elapsed) => {
      molGroup.rotation.y = elapsed * 0.75;
      molGroup.rotation.x = Math.sin(elapsed * 0.6) * 0.3;
      stageGroup.rotation.y = elapsed * 0.24;
    };
  } else if (kind === 'biology-cell-organ') {
    // 3D DNA Double Helix + Cellular Membrane Wall ring
    const helixGroup = new THREE.Group();
    const strandA: THREE.Vector3[] = [];
    const strandB: THREE.Vector3[] = [];
    const rungGeo = track(new THREE.CylinderGeometry(0.032, 0.032, 1.05, 8));
    rungGeo.rotateZ(Math.PI / 2);

    for (let i = 0; i <= 16; i++) {
      const t = i / 16;
      const y = 0.2 + t * 2.1;
      const ang = t * Math.PI * 2.6;
      const r = 0.56;
      const pA = new THREE.Vector3(Math.cos(ang) * r, y, Math.sin(ang) * r);
      const pB = new THREE.Vector3(Math.cos(ang + Math.PI) * r, y, Math.sin(ang + Math.PI) * r);
      strandA.push(pA);
      strandB.push(pB);

      if (i % 2 === 0 && i > 0 && i < 16) {
        const rung = new THREE.Mesh(rungGeo, i % 4 === 0 ? goldMat : brushedSteelMat);
        rung.position.set(0, y, 0);
        rung.rotation.y = -ang;
        helixGroup.add(rung);
      }
    }
    const curveA = new THREE.CatmullRomCurve3(strandA);
    const curveB = new THREE.CatmullRomCurve3(strandB);
    const tubeAGeo = track(new THREE.TubeGeometry(curveA, 40, 0.06, 10, false));
    const tubeBGeo = track(new THREE.TubeGeometry(curveB, 40, 0.06, 10, false));
    helixGroup.add(new THREE.Mesh(tubeAGeo, accentMat));
    helixGroup.add(new THREE.Mesh(tubeBGeo, goldMat));
    stageGroup.add(helixGroup);

    animateFn = (elapsed) => {
      helixGroup.rotation.y = elapsed * 0.7;
    };
  } else if (kind === 'ict-network-logic') {
    // Central Server/CPU tower + 4 satellite nodes + glowing packet cubes on link tubes
    const hubGeo = track(new THREE.BoxGeometry(0.75, 1.15, 0.75));
    const hub = new THREE.Mesh(hubGeo, brushedSteelMat);
    hub.position.y = 0.65;
    stageGroup.add(hub);

    const nodeGeo = track(new THREE.BoxGeometry(0.42, 0.42, 0.42));
    const linkGeo = track(new THREE.CylinderGeometry(0.025, 0.025, 1.45, 8));
    linkGeo.rotateZ(Math.PI / 2);
    const packetGeo = track(new THREE.BoxGeometry(0.14, 0.14, 0.14));
    const packets: { mesh: THREE.Mesh; angle: number }[] = [];

    for (let i = 0; i < 4; i++) {
      const ang = (i * Math.PI) / 2 + Math.PI / 4;
      const dist = 1.45;
      const node = new THREE.Mesh(nodeGeo, goldMat);
      node.position.set(Math.cos(ang) * dist, 0.35, Math.sin(ang) * dist);
      stageGroup.add(node);

      const link = new THREE.Mesh(linkGeo, accentMat);
      link.position.set(Math.cos(ang) * (dist / 2), 0.35, Math.sin(ang) * (dist / 2));
      link.rotation.y = -ang;
      stageGroup.add(link);

      const pkt = new THREE.Mesh(packetGeo, accentMat);
      stageGroup.add(pkt);
      packets.push({ mesh: pkt, angle: ang });
    }

    animateFn = (elapsed, progress) => {
      packets.forEach((p, idx) => {
        const d = 0.35 + ((elapsed * 0.8 + progress + idx * 0.25) % 1) * 1.1;
        p.mesh.position.set(Math.cos(p.angle) * d, 0.48, Math.sin(p.angle) * d);
      });
      stageGroup.rotation.y = elapsed * 0.25;
    };
  } else if (kind === 'grammar-pillars') {
    // Classical 3-Pillar Architecture supporting a crowning Beam (Subject · Verb · Object / Thesis · Evidence · Style)
    const pillarGeo = track(new THREE.CylinderGeometry(0.22, 0.26, 1.45, 20));
    const xPos = [-1.15, 0, 1.15];
    xPos.forEach((x, idx) => {
      const p = new THREE.Mesh(pillarGeo, idx === 1 ? goldMat : brushedSteelMat);
      p.position.set(x, 0.78, 0);
      stageGroup.add(p);
    });
    const archGeo = track(new THREE.BoxGeometry(2.95, 0.28, 0.72));
    const arch = new THREE.Mesh(archGeo, accentMat);
    arch.position.set(0, 1.65, 0);
    stageGroup.add(arch);

    const roofShape = new THREE.Shape();
    roofShape.moveTo(-1.55, 0);
    roofShape.lineTo(0, 0.65);
    roofShape.lineTo(1.55, 0);
    roofShape.closePath();
    const roofGeo = track(
      new THREE.ExtrudeGeometry(roofShape, { depth: 0.68, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03 })
    );
    roofGeo.center();
    const roof = new THREE.Mesh(roofGeo, brushedSteelMat);
    roof.position.set(0, 2.12, 0);
    stageGroup.add(roof);

    animateFn = (elapsed) => {
      stageGroup.rotation.y = Math.sin(elapsed * 0.4) * 0.45;
    };
  } else {
    // 'governance-scale': Balanced Constitutional Fulcrum + Twin Scales + Orbital Globe Ring
    const mastGeo = track(new THREE.CylinderGeometry(0.12, 0.18, 1.85, 20));
    const mast = new THREE.Mesh(mastGeo, brushedSteelMat);
    mast.position.y = 0.92;
    stageGroup.add(mast);

    const beamGroup = new THREE.Group();
    beamGroup.position.y = 1.85;
    const beamGeo = track(new THREE.BoxGeometry(2.45, 0.1, 0.16));
    beamGroup.add(new THREE.Mesh(beamGeo, goldMat));

    const panGeo = track(new THREE.CylinderGeometry(0.45, 0.32, 0.14, 24));
    const panL = new THREE.Mesh(panGeo, accentMat);
    panL.position.set(-1.12, -0.58, 0);
    const panR = new THREE.Mesh(panGeo, accentMat);
    panR.position.set(1.12, -0.58, 0);
    beamGroup.add(panL, panR);
    stageGroup.add(beamGroup);

    const crownSphereGeo = track(new THREE.SphereGeometry(0.28, 18, 18));
    const crown = new THREE.Mesh(crownSphereGeo, accentMat);
    crown.position.y = 2.12;
    stageGroup.add(crown);

    animateFn = (elapsed) => {
      beamGroup.rotation.z = Math.sin(elapsed * 1.4) * 0.12;
      stageGroup.rotation.y = elapsed * 0.25;
    };
  }

  return {
    root,
    disposables,
    animate: animateFn,
  };
}

export const VideoLesson3DStage: React.FC<VideoLesson3DStageProps> = ({
  visual3DKind,
  sceneTitle,
  accentHex,
  isPlaying,
  syncProgress,
  sceneIdx,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [contextLost, setContextLost] = useState(false);

  const stateRef = useRef({
    isPlaying,
    syncProgress,
    sceneIdx,
    visual3DKind,
    accentHex,
  });
  stateRef.current = { isPlaying, syncProgress, sceneIdx, visual3DKind, accentHex };

  const swapModelRef = useRef<(kind: Video3DVisualKind, accent: string) => void>(() => {});
  const resetCamRef = useRef<() => void>(() => {});
  const requestRenderRef = useRef<() => void>(() => {});
  const startLoopRef = useRef<() => void>(() => {});

  useEffect(() => {
    swapModelRef.current(visual3DKind, accentHex);
  }, [visual3DKind, accentHex]);

  useEffect(() => {
    if (isPlaying) {
      startLoopRef.current();
    } else {
      requestRenderRef.current();
    }
  }, [isPlaying, sceneIdx]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isSoftwareGl = detectSoftwareGl();
    const width = Math.max(260, mount.clientWidth || 440);
    const height = Math.max(220, mount.clientHeight || 340);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: isSoftwareGl,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.setAttribute('data-testid', 'video-3d-canvas');
    mount.replaceChildren(canvas);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);

    const scene = new THREE.Scene();
    const bgHex = 0x070b14;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.035);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    const defaultPos = new THREE.Vector3(3.8, 3.1, 5.2);
    const defaultTarget = new THREE.Vector3(0, 1.15, 0);
    camera.position.copy(defaultPos);

    const controls = new OrbitControls(camera, canvas);
    controls.target.copy(defaultTarget);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.minDistance = 2.6;
    controls.maxDistance = 12;
    controls.update();

    // Three-point warm/cool studio lighting rig
    scene.add(new THREE.HemisphereLight(0xbfe0ff, 0x1e293b, 1.35));
    const keyLight = new THREE.DirectionalLight(0xfff1d6, 2.4);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = !isSoftwareGl;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.15);
    rimLight.position.set(-5, 4, -5);
    scene.add(rimLight);

    // Ground plane + contact shadow
    const shadowTex = createContactShadowTexture();
    const floorGeo = new THREE.CircleGeometry(7, 36);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x0b1220, roughness: 0.9, metalness: 0.05 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const cShadowGeo = new THREE.CircleGeometry(2.8, 32);
    const cShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const cShadow = new THREE.Mesh(cShadowGeo, cShadowMat);
    cShadow.rotation.x = -Math.PI / 2;
    cShadow.position.y = 0.015;
    scene.add(cShadow);

    let activeModel: BuiltModel | null = null;
    const disposeActiveModel = () => {
      if (!activeModel) return;
      scene.remove(activeModel.root);
      for (const item of activeModel.disposables) {
        item.dispose();
      }
      activeModel = null;
    };

    const loadModel = (kind: Video3DVisualKind, accent: string) => {
      disposeActiveModel();
      activeModel = buildEducationalModel(kind, accent);
      scene.add(activeModel.root);
      activeModel.animate(0, stateRef.current.syncProgress);
    };

    loadModel(stateRef.current.visual3DKind, stateRef.current.accentHex);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let frameId = 0;
    let timeoutId = 0;
    let disposed = false;
    let renderBusy = false;
    let renderDirty = false;
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
        controls.update();
        activeModel?.animate(elapsed, stateRef.current.syncProgress);
        renderer.render(scene, camera);
        const done = () => {
          renderBusy = false;
          if (!disposed && renderDirty) requestRender();
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    };
    requestRenderRef.current = requestRender;

    swapModelRef.current = (kind, accent) => {
      if (disposed) return;
      loadModel(kind, accent);
      requestRender();
    };

    resetCamRef.current = () => {
      camera.position.copy(defaultPos);
      controls.target.copy(defaultTarget);
      controls.update();
      requestRender();
    };

    let lastTime = performance.now();
    const tick = () => {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      if (stateRef.current.isPlaying) {
        elapsed += dt;
      }
      controls.update();
      activeModel?.animate(elapsed, stateRef.current.syncProgress);
      renderer.render(scene, camera);

      if (stateRef.current.isPlaying) {
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

    const handleControlsChange = () => {
      if (!loopRunning) requestRender();
    };
    controls.addEventListener('change', handleControlsChange);

    let resizeRaf = 0;
    let lastObservedW = Math.floor(mount.clientWidth);
    let lastObservedH = Math.floor(mount.clientHeight);
    const resizeObserver = new ResizeObserver((entries) => {
      if (disposed) return;
      const rect = entries[0]?.contentRect;
      if (!rect || rect.width <= 0 || rect.height <= 0) return;
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      if (w === lastObservedW && h === lastObservedH) return;
      lastObservedW = w;
      lastObservedH = h;
      if (resizeRaf) window.cancelAnimationFrame(resizeRaf);
      resizeRaf = window.requestAnimationFrame(() => {
        resizeRaf = 0;
        if (disposed) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        requestRender();
      });
    });
    resizeObserver.observe(mount);

    // Paint initial static frame synchronously (no auto-loop until user clicks Play)
    renderer.render(scene, camera);
    if (stateRef.current.isPlaying) {
      startLoop();
    }

    return () => {
      disposed = true;
      loopRunning = false;
      window.cancelAnimationFrame(frameId);
      if (resizeRaf) window.cancelAnimationFrame(resizeRaf);
      window.clearTimeout(timeoutId);
      resizeObserver.disconnect();
      controls.removeEventListener('change', handleControlsChange);
      controls.dispose();
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      disposeActiveModel();
      envTex.dispose();
      shadowTex.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      cShadowGeo.dispose();
      cShadowMat.dispose();
      renderer.dispose();
      mount.replaceChildren();
    };
  }, []);

  const meta = VISUAL_3D_LABELS[visual3DKind];

  return (
    <div
      data-testid="video-3d-stage"
      className="relative w-full h-full min-h-[260px] rounded-xl overflow-hidden border border-slate-800 bg-[#070b14]"
    >
      <div ref={mountRef} className="w-full h-full" />

      {contextLost && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-xs text-slate-300"
          style={{ backgroundColor: 'rgba(7, 11, 20, 0.94)' }}
        >
          <Box className="w-6 h-6 text-cyan-400 mb-2" />
          <p className="font-semibold text-white">3D WebGL context paused — restoring model...</p>
        </div>
      )}

      {/* Top HUD Bar (Solid rgba, no backdrop-filter over WebGL, zero overlap) */}
      <div className="pointer-events-none absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-2">
        <div
          className="min-w-0 flex-1 rounded-lg px-2.5 py-1.5 border border-slate-700/80"
          style={{ backgroundColor: 'rgba(9, 13, 22, 0.9)' }}
        >
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-300">
            <Box className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{meta.title}</span>
          </div>
          <div className="text-[10px] text-slate-300 truncate">{sceneTitle} · {meta.hint}</div>
        </div>

        <button
          type="button"
          onClick={() => resetCamRef.current()}
          aria-label="Reset 3D lesson illustration camera"
          className="pointer-events-auto shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700/80 text-[11px] font-medium text-slate-200 hover:text-white transition-colors"
          style={{ backgroundColor: 'rgba(9, 13, 22, 0.9)' }}
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Reset 3D</span>
        </button>
      </div>

      {/* Bottom Interactive Drag Hint */}
      <div
        className="pointer-events-none absolute bottom-2.5 right-2.5 rounded-md px-2 py-1 border border-slate-800 text-[10px] font-mono text-slate-400"
        style={{ backgroundColor: 'rgba(9, 13, 22, 0.88)' }}
      >
        Drag to orbit · Scroll to zoom
      </div>
    </div>
  );
};
