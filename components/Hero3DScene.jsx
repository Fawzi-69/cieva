"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Environment map procédurale (reflets métal/verre) — aucun asset externe à charger
function Env() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const tex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = tex;
    return () => {
      scene.environment = null;
      tex.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const N_OBJ = 7;
const ABSORB_STEP = 1.4; // radians de rotation cumulée par objet aspiré
const GROUP_SCALE = 0.62;
const GROUP_Y = -0.05;

// ---------- Objets en orbite : enveloppes, dossiers, factures (low-poly) ----------
function makeItemMesh(kind) {
  const g = new THREE.Group();
  if (kind === "email") {
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.32, 0.02),
      new THREE.MeshStandardMaterial({ color: "#EDEFF8", roughness: 0.7, metalness: 0.05 })
    );
    const flap = new THREE.Mesh(
      new THREE.ConeGeometry(0.23, 0.15, 4),
      new THREE.MeshStandardMaterial({ color: "#D8DCEE", roughness: 0.7 })
    );
    flap.rotation.z = Math.PI;
    flap.rotation.y = Math.PI / 4;
    flap.scale.set(1, 1, 0.12);
    flap.position.set(0, 0.085, 0.012);
    g.add(body, flap);
  } else if (kind === "dossier") {
    const back = new THREE.Mesh(
      new THREE.BoxGeometry(0.52, 0.38, 0.015),
      new THREE.MeshStandardMaterial({ color: "#D9C49A", roughness: 0.8 })
    );
    const tab = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.06, 0.015),
      new THREE.MeshStandardMaterial({ color: "#D9C49A", roughness: 0.8 })
    );
    tab.position.set(-0.15, 0.215, 0);
    const front = new THREE.Mesh(
      new THREE.BoxGeometry(0.52, 0.34, 0.012),
      new THREE.MeshStandardMaterial({ color: "#E6D4AC", roughness: 0.8 })
    );
    front.position.set(0, -0.02, 0.015);
    g.add(back, tab, front);
  } else {
    // facture : feuille fine avec liseré
    const sheet = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.46, 0.01),
      new THREE.MeshStandardMaterial({ color: "#F2F4FB", roughness: 0.65 })
    );
    const band = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.05, 0.012),
      new THREE.MeshStandardMaterial({ color: "#B9C2E2", roughness: 0.6 })
    );
    band.position.set(0, 0.14, 0.003);
    g.add(sheet, band);
  }
  g.traverse((o) => {
    if (o.isMesh) o.material.side = THREE.FrontSide;
  });
  return g;
}

function Scene({ ctrl, onFacing, onRectReady }) {
  const { scene } = useGLTF(`${BASE}/phone.glb`);
  const root = useRef();
  const { camera, size } = useThree();
  const items = useRef([]);
  const screenMeshRef = useRef(null);
  const phoneRotRef = useRef(0);
  const facingRef = useRef(false);
  const t0 = useRef(0);

  // Téléphone : écran éteint, backface culling partout
  useMemo(() => {
    let screenMesh = null;
    scene.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      const isScreen = mats[0].color && mats[0].color.r > 0.6 && mats[0].color.g > 0.6 && mats[0].color.b > 0.6;
      if (isScreen && !screenMesh) screenMesh = o;
      mats.forEach((m) => {
        m.side = THREE.FrontSide;
        if (m.emissive) m.emissive.setScalar(0);
        if (isScreen) {
          m.color.setRGB(0.02, 0.03, 0.08);
          if ("metalness" in m) m.metalness = 0;
          if ("roughness" in m) m.roughness = 0.55;
        } else {
          if ("metalness" in m) m.metalness = 0.75;
          if ("roughness" in m) m.roughness = 0.28;
          if ("envMapIntensity" in m) m.envMapIntensity = 1.25;
        }
        m.needsUpdate = true;
      });
    });
    screenMeshRef.current = screenMesh;

    // Le glb est posé en diagonale dans son espace local : on le redresse par PCA.
    // Axe le plus fin = normale de l'écran (→ +Z caméra), axe le plus long = vertical (→ +Y).
    scene.updateMatrixWorld(true);
    let big = null;
    scene.traverse((o) => {
      if (o.isMesh && (!big || o.geometry.attributes.position.count > big.geometry.attributes.position.count)) big = o;
    });
    if (big) {
      const pos = big.geometry.attributes.position;
      const step = Math.max(1, Math.floor(pos.count / 4000));
      const mean = new THREE.Vector3();
      let n = 0;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i += step) {
        v.set(pos.getX(i), pos.getY(i), pos.getZ(i)).applyMatrix4(big.matrixWorld);
        mean.add(v);
        n++;
      }
      mean.multiplyScalar(1 / n);
      let xx = 0, xy = 0, xz = 0, yy = 0, yz = 0, zz = 0;
      for (let i = 0; i < pos.count; i += step) {
        v.set(pos.getX(i), pos.getY(i), pos.getZ(i)).applyMatrix4(big.matrixWorld).sub(mean);
        xx += v.x * v.x; xy += v.x * v.y; xz += v.x * v.z;
        yy += v.y * v.y; yz += v.y * v.z; zz += v.z * v.z;
      }
      const C = [[xx, xy, xz], [xy, yy, yz], [xz, yz, zz]];
      const mulC = (a) => [
        C[0][0] * a[0] + C[0][1] * a[1] + C[0][2] * a[2],
        C[1][0] * a[0] + C[1][1] * a[1] + C[1][2] * a[2],
        C[2][0] * a[0] + C[2][1] * a[1] + C[2][2] * a[2],
      ];
      const norm3 = (a) => {
        const l = Math.hypot(a[0], a[1], a[2]) || 1;
        return [a[0] / l, a[1] / l, a[2] / l];
      };
      const power = (deflate) => {
        let a = norm3([Math.random() + 0.1, Math.random() + 0.1, Math.random() + 0.1]);
        for (let k = 0; k < 60; k++) {
          let b = mulC(a);
          deflate.forEach((d) => {
            const dot = b[0] * d[0] + b[1] * d[1] + b[2] * d[2];
            b = [b[0] - dot * d[0], b[1] - dot * d[1], b[2] - dot * d[2]];
          });
          a = norm3(b);
        }
        return a;
      };
      const e1 = power([]); // plus grande variance = axe long (hauteur)
      const e2 = power([e1]); // moyenne = largeur
      const yAxis = new THREE.Vector3(...e1);
      const xAxis = new THREE.Vector3(...e2);
      const zAxis = new THREE.Vector3().crossVectors(xAxis, yAxis).normalize(); // plus fin = normale écran
      xAxis.crossVectors(yAxis, zAxis).normalize();
      // base (x,y,z) du téléphone → base monde : rotation = transposée
      const m = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis).transpose();
      const qTotal = new THREE.Quaternion().setFromRotationMatrix(m);

      // Raffinement : la PCA est biaisée par les coins arrondis et la bosse caméra.
      // yaw/pitch → épaisseur Z minimale (pile de face) ; roll → largeur X minimale (vertical).
      const pts = [];
      for (let i = 0; i < pos.count; i += step) {
        const p = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)).applyMatrix4(big.matrixWorld);
        p.applyQuaternion(qTotal);
        pts.push(p);
      }
      const extent = (axisIdx) => {
        let lo = Infinity, hi = -Infinity;
        for (const p of pts) {
          const val = axisIdx === 0 ? p.x : axisIdx === 1 ? p.y : p.z;
          if (val < lo) lo = val;
          if (val > hi) hi = val;
        }
        return hi - lo;
      };
      const refine = (axisVec, critAxis) => {
        let best = 0, bestV = Infinity;
        const qt = new THREE.Quaternion();
        for (let a = -0.35; a <= 0.35; a += 0.01) {
          qt.setFromAxisAngle(axisVec, a);
          let lo = Infinity, hi = -Infinity;
          for (const p of pts) {
            const r = p.clone().applyQuaternion(qt);
            const val = critAxis === 0 ? r.x : r.z;
            if (val < lo) lo = val;
            if (val > hi) hi = val;
          }
          if (hi - lo < bestV) { bestV = hi - lo; best = a; }
        }
        qt.setFromAxisAngle(axisVec, best);
        pts.forEach((p) => p.applyQuaternion(qt));
        qTotal.premultiply(qt);
      };
      refine(new THREE.Vector3(0, 1, 0), 2); // yaw : épaisseur Z min
      refine(new THREE.Vector3(1, 0, 0), 2); // pitch : épaisseur Z min
      refine(new THREE.Vector3(0, 0, 1), 0); // roll : largeur X min

      // rotation calculée en espace monde → composer (idempotent au double-mount de dev)
      scene.quaternion.premultiply(qTotal);
      // recentrage
      scene.position.set(0, 0, 0);
      scene.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(scene);
      const c = new THREE.Vector3();
      box.getCenter(c);
      scene.position.sub(c);
    }
  }, [scene]);

  // Objets en orbite
  const defs = useMemo(() => {
    const kinds = ["email", "dossier", "facture", "email", "facture", "dossier", "facture"];
    return Array.from({ length: N_OBJ }, (_, i) => ({
      mesh: makeItemMesh(kinds[i % kinds.length]),
      theta: (i / N_OBJ) * Math.PI * 2,
      radius: 1.55 + (i % 2) * 0.45,
      y: -0.25 + (((i * 37) % 100) / 100) * 0.9,
      speed: 0.12 + ((i * 13) % 10) / 100,
      spin: 0.3 + ((i * 7) % 10) / 20,
      t: 0, // progression d'aspiration
    }));
  }, []);

  useEffect(() => {
    const r = root.current;
    if (!r) return;
    defs.forEach((d) => r.add(d.mesh));
    items.current = defs;
    return () => defs.forEach((d) => r.remove(d.mesh));
  }, [defs]);

  // Rect écran en pixels (pose de face, caméra fixe) → overlay UI HTML.
  // Face avant de la bbox du téléphone aligné, avec marge pour la bordure.
  useEffect(() => {
    const r = root.current;
    if (!r) return;
    const prev = r.rotation.y;
    r.rotation.y = 0;
    r.updateMatrixWorld(true);
    const b = new THREE.Box3().setFromObject(scene); // le téléphone seul, pas les objets en orbite
    r.rotation.y = prev;
    const w = b.max.x - b.min.x;
    const h = b.max.y - b.min.y;
    const inX = w * 0.075; // bordure / bezel
    const inY = h * 0.045;
    const toPx = (x, y, z) => {
      const p = new THREE.Vector3(x, y, z).project(camera);
      return { x: (p.x * 0.5 + 0.5) * size.width, y: (-p.y * 0.5 + 0.5) * size.height };
    };
    const a = toPx(b.min.x + inX, b.max.y - inY, b.max.z);
    const c = toPx(b.max.x - inX, b.min.y + inY, b.max.z);
    onRectReady({ left: a.x, top: a.y, width: c.x - a.x, height: c.y - a.y });
  }, [camera, size, onRectReady, scene]);

  useFrame((_, dt) => {
    const s = ctrl.current;
    const r = root.current;
    if (!r) return;
    t0.current += dt;

    // ressort de retour face caméra + inertie (quasi amorti critique)
    if (!s.dragging) {
      const norm = Math.atan2(Math.sin(s.angle), Math.cos(s.angle));
      s.vel += -norm * 26 * dt;
      s.vel *= Math.exp(-6.5 * dt);
      s.angle += s.vel * dt;
    }
    r.rotation.y = s.angle;

    // aspiration progressive, un objet à la fois
    const targetCount = Math.min(N_OBJ, Math.floor(s.turn / ABSORB_STEP));
    items.current.forEach((d, i) => {
      if (i < targetCount && d.t < 1) d.t = Math.min(1, d.t + dt * 1.4);
      const e = d.t < 0.5 ? 2 * d.t * d.t : 1 - Math.pow(-2 * d.t + 2, 2) / 2; // easeInOut
      const th = d.theta + t0.current * d.speed + e * 5;
      const rad = d.radius * (1 - e);
      const y = d.y * (1 - e) + 0.02 * Math.sin(t0.current * 1.3 + i) * (1 - e);
      d.mesh.position.set(Math.cos(th) * rad, y - 0.12 * e, Math.sin(th) * rad);
      d.mesh.rotation.set(0.15, th + Math.PI / 2 + d.spin * Math.sin(t0.current * 0.6 + i) * (1 - e), 0.08);
      const sc = 1 - e;
      d.mesh.scale.set(sc, sc, sc);
      d.mesh.visible = d.t < 1;
    });

    // "de face + stable + tout absorbé" → UI (jamais pendant la rotation)
    const norm = Math.atan2(Math.sin(s.angle), Math.cos(s.angle));
    const facing =
      targetCount >= N_OBJ &&
      items.current.every((d) => d.t >= 1) &&
      !s.dragging &&
      Math.abs(norm) < 0.1 &&
      Math.abs(s.vel) < 0.12;
    if (facing !== facingRef.current) {
      facingRef.current = facing;
      onFacing(facing);
    }
  });

  return (
    <group position={[0, GROUP_Y, 0]} scale={GROUP_SCALE}>
      <group ref={root}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

export default function Hero3DScene({ ctrl, onFacing, onRectReady }) {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 35 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }} style={{ background: "transparent" }}>
      <Env />
      <ambientLight intensity={0.35} />
      {/* key light */}
      <directionalLight position={[3, 5, 5]} intensity={2.6} />
      {/* rim light froide, par l'arrière, pour détacher les tranches */}
      <directionalLight position={[-3, 2, -4]} intensity={2.4} color="#9FC2FF" />
      <pointLight position={[-5, -1, 2]} intensity={50} color="#7B5CFF" />
      <pointLight position={[5, 3, 3]} intensity={40} color="#4FA8FF" />
      <pointLight position={[0, 0, -5]} intensity={40} color="#C05CFF" />
      <Scene ctrl={ctrl} onFacing={onFacing} onRectReady={onRectReady} />
    </Canvas>
  );
}

useGLTF.preload(`${BASE}/phone.glb`);
