"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const N_OBJ = 6;
const ABSORB_STEP = 0.78; // radians de rotation cumulée par objet aspiré (~1,5 tour pour tout)
const AUTO_DELAY = 6000; // ms sans interaction avant auto-aspiration
const AUTO_RATE = 0.35; // rad/s de rotation "virtuelle" en auto
const GROUP_SCALE = 0.62;
const GROUP_Y = -0.05;

// Téléphone procédural : géométrie FERMÉE par construction (le glb d'origine était
// un mesh ouvert, non soudé — cause du rendu creux ; voir NOTES).
const BODY_W = 1.02, BODY_H = 2.1, BODY_D = 0.085, BODY_R = 0.1;
const SCREEN_W = 0.93, SCREEN_H = 2.0;

// Environment map procédurale (reflets métal/verre) — aucun asset externe
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

function Phone() {
  return (
    <group>
      {/* châssis métal */}
      <RoundedBox args={[BODY_W, BODY_H, BODY_D]} radius={BODY_R * 0.7} smoothness={5}>
        <meshStandardMaterial color="#39415F" metalness={0.95} roughness={0.32} envMapIntensity={1.4} />
      </RoundedBox>
      {/* verre avant (écran éteint) */}
      <RoundedBox args={[SCREEN_W, SCREEN_H, 0.014]} radius={0.07} smoothness={5} position={[0, 0, BODY_D / 2]}>
        <meshPhysicalMaterial color="#05070F" metalness={0} roughness={0.3} envMapIntensity={0.5} specularIntensity={0.25} />
      </RoundedBox>
      {/* verre arrière */}
      <RoundedBox args={[SCREEN_W, SCREEN_H, 0.012]} radius={0.07} smoothness={5} position={[0, 0, -BODY_D / 2]}>
        <meshStandardMaterial color="#232B4A" metalness={0.35} roughness={0.22} envMapIntensity={1.2} />
      </RoundedBox>
      {/* encoche caméra frontale (pastille) */}
      <mesh position={[0, SCREEN_H / 2 - 0.09, BODY_D / 2 + 0.009]}>
        <cylinderGeometry args={[0.028, 0.028, 0.006, 24]} />
        <meshStandardMaterial color="#0B0E1A" metalness={0.2} roughness={0.35} />
      </mesh>
      {/* îlot caméra arrière */}
      <group position={[-BODY_W / 2 + 0.26, BODY_H / 2 - 0.28, -BODY_D / 2 - 0.015]}>
        <RoundedBox args={[0.36, 0.36, 0.035]} radius={0.09} smoothness={4}>
          <meshStandardMaterial color="#2C3454" metalness={0.85} roughness={0.3} envMapIntensity={1.3} />
        </RoundedBox>
        {[[-0.075, 0.075], [0.075, -0.075]].map(([x, y], k) => (
          <group key={k} position={[x, y, 0.02]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.062, 0.062, 0.02, 28]} />
              <meshStandardMaterial color="#161B30" metalness={0.9} roughness={0.25} envMapIntensity={1.4} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.011]}>
              <cylinderGeometry args={[0.034, 0.034, 0.004, 24]} />
              <meshStandardMaterial color="#0A0E1E" metalness={0.3} roughness={0.1} envMapIntensity={2} />
            </mesh>
          </group>
        ))}
        {/* flash */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0.095, 0.095, 0.02]}>
          <cylinderGeometry args={[0.022, 0.022, 0.01, 20]} />
          <meshStandardMaterial color="#E8E4D2" metalness={0.1} roughness={0.4} emissive="#3A3524" emissiveIntensity={0.4} />
        </mesh>
      </group>
      {/* boutons tranche droite */}
      {[0.52, 0.28].map((y, k) => (
        <RoundedBox key={k} args={[0.016, k === 0 ? 0.2 : 0.14, 0.04]} radius={0.007} smoothness={3} position={[BODY_W / 2 + 0.004, y, 0]}>
          <meshStandardMaterial color="#454E70" metalness={0.95} roughness={0.3} envMapIntensity={1.4} />
        </RoundedBox>
      ))}
      {/* bouton tranche gauche */}
      <RoundedBox args={[0.016, 0.1, 0.04]} radius={0.007} smoothness={3} position={[-BODY_W / 2 - 0.004, 0.55, 0]}>
        <meshStandardMaterial color="#454E70" metalness={0.95} roughness={0.3} envMapIntensity={1.4} />
      </RoundedBox>
    </group>
  );
}

// ---------- Objets en orbite : 6 objets métiers (couleur = produit) ----------
const mat = (color, opt = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.1, envMapIntensity: 0.9, ...opt });

function makeItemMesh(kind) {
  const g = new THREE.Group();
  const add = (geo, material, x = 0, y = 0, z = 0, rot) => {
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(x, y, z);
    if (rot) mesh.rotation.set(rot[0], rot[1], rot[2]);
    g.add(mesh);
    return mesh;
  };

  if (kind === "camion") {
    // Sielo — transport (bleu)
    add(new THREE.BoxGeometry(0.34, 0.2, 0.2), mat("#EDEFF8", { roughness: 0.6 }), -0.06, 0.04, 0); // caisse
    add(new THREE.BoxGeometry(0.15, 0.15, 0.19), mat("#009FE3", { roughness: 0.4, metalness: 0.3 }), 0.19, 0.015, 0); // cabine
    add(new THREE.BoxGeometry(0.14, 0.05, 0.185), mat("#0C7DB0"), 0.19, 0.078, 0); // toit cabine
    const wheel = new THREE.CylinderGeometry(0.048, 0.048, 0.03, 18);
    const wm = mat("#171B2E", { roughness: 0.8 });
    [[-0.16, 0.09], [0.06, 0.09], [0.19, 0.09]].forEach(([x, zz]) => {
      add(wheel, wm, x, -0.075, zz, [Math.PI / 2, 0, 0]);
      add(wheel, wm, x, -0.075, -zz, [Math.PI / 2, 0, 0]);
    });
  } else if (kind === "colis") {
    // logistique — carton
    add(new THREE.BoxGeometry(0.26, 0.2, 0.22), mat("#C9A06C", { roughness: 0.85 }));
    add(new THREE.BoxGeometry(0.262, 0.202, 0.05), mat("#E4D3AE", { roughness: 0.8 })); // scotch
    add(new THREE.BoxGeometry(0.05, 0.202, 0.222), mat("#E4D3AE", { roughness: 0.8 }));
  } else if (kind === "casque") {
    // Vela — chantier (violet)
    add(
      new THREE.SphereGeometry(0.15, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2),
      mat("#7C5CFF", { roughness: 0.35, metalness: 0.15, envMapIntensity: 1.1 })
    );
    add(new THREE.CylinderGeometry(0.2, 0.21, 0.022, 26), mat("#6A4EE0", { roughness: 0.4 }), 0, 0.0, 0);
    add(new THREE.BoxGeometry(0.09, 0.02, 0.3), mat("#6A4EE0", { roughness: 0.4 }), 0, 0.11, 0); // arête
  } else if (kind === "outils") {
    // Vela — boîte à outils
    add(new THREE.BoxGeometry(0.32, 0.15, 0.14), mat("#B49BFF", { roughness: 0.4, metalness: 0.35 }));
    add(new THREE.BoxGeometry(0.32, 0.03, 0.14), mat("#9D82F5", { roughness: 0.4, metalness: 0.35 }), 0, 0.09, 0); // couvercle
    add(new THREE.BoxGeometry(0.12, 0.035, 0.03), mat("#2A2F4E", { roughness: 0.5 }), 0, 0.125, 0); // poignée
    add(new THREE.BoxGeometry(0.04, 0.05, 0.145), mat("#2A2F4E"), 0, 0.02, 0); // fermoir
  } else if (kind === "combine") {
    // Lyra — casque-micro d'accueil vocal (teal)
    const tm = mat("#12A594", { roughness: 0.35, metalness: 0.2, envMapIntensity: 1.1 });
    const dark = mat("#0C7264", { roughness: 0.5 });
    add(new THREE.TorusGeometry(0.13, 0.026, 12, 28, Math.PI), tm); // arceau
    add(new THREE.CylinderGeometry(0.05, 0.05, 0.045, 18), dark, -0.13, -0.01, 0, [0, 0, Math.PI / 2]); // écouteur g
    add(new THREE.CylinderGeometry(0.05, 0.05, 0.045, 18), dark, 0.13, -0.01, 0, [0, 0, Math.PI / 2]); // écouteur d
    add(new THREE.CylinderGeometry(0.012, 0.012, 0.14, 10), tm, 0.09, -0.09, 0.03, [0, 0, 0.9]); // perche micro
    add(new THREE.SphereGeometry(0.028, 14, 10), dark, 0.02, -0.13, 0.045); // micro
  } else {
    // calendrier — planning
    add(new THREE.BoxGeometry(0.26, 0.3, 0.035), mat("#F2F4FB", { roughness: 0.6 }));
    add(new THREE.BoxGeometry(0.26, 0.075, 0.037), mat("#4FA8FF", { roughness: 0.45 }), 0, 0.112, 0); // bandeau
    const ring = new THREE.TorusGeometry(0.02, 0.007, 8, 14);
    const rm = mat("#8891B8", { metalness: 0.7, roughness: 0.3 });
    add(ring, rm, -0.07, 0.155, 0);
    add(ring, rm, 0.07, 0.155, 0);
    add(new THREE.BoxGeometry(0.055, 0.055, 0.038), mat("#7C5CFF", { roughness: 0.5 }), -0.06, -0.04, 0); // jour marqué
  }
  g.traverse((o) => {
    if (o.isMesh) o.material.side = THREE.FrontSide;
  });
  return g;
}

function Scene({ ctrl, onFacing, onRectReady }) {
  const root = useRef();
  const { camera, size } = useThree();
  const items = useRef([]);
  const facingRef = useRef(false);
  const t0 = useRef(0);

  // Objets en orbite : un par facette métier
  const defs = useMemo(() => {
    const kinds = ["camion", "casque", "combine", "colis", "outils", "calendrier"];
    return Array.from({ length: N_OBJ }, (_, i) => ({
      mesh: makeItemMesh(kinds[i % kinds.length]),
      theta: (i / N_OBJ) * Math.PI * 2,
      radius: 1.55 + (i % 2) * 0.45,
      y: -0.25 + (((i * 37) % 100) / 100) * 0.9,
      speed: 0.12 + ((i * 13) % 10) / 100,
      spin: 0.3 + ((i * 7) % 10) / 20,
      t: 0,
    }));
  }, []);

  useEffect(() => {
    const r = root.current;
    if (!r) return;
    defs.forEach((d) => r.add(d.mesh));
    items.current = defs;
    return () => defs.forEach((d) => r.remove(d.mesh));
  }, [defs]);

  // Rect écran en pixels : dimensions connues (téléphone procédural), caméra fixe
  useEffect(() => {
    const s = GROUP_SCALE;
    const zFront = (BODY_D / 2 + 0.014) * s;
    const inX = SCREEN_W * 0.045 * s;
    const inY = SCREEN_H * 0.03 * s;
    const toPx = (x, y) => {
      const p = new THREE.Vector3(x, y, zFront).project(camera);
      return { x: (p.x * 0.5 + 0.5) * size.width, y: (-p.y * 0.5 + 0.5) * size.height };
    };
    const a = toPx((-SCREEN_W / 2) * s + inX, (SCREEN_H / 2) * s + GROUP_Y - inY);
    const c = toPx((SCREEN_W / 2) * s - inX, (-SCREEN_H / 2) * s + GROUP_Y + inY);
    onRectReady({ left: a.x, top: a.y, width: c.x - a.x, height: c.y - a.y });
  }, [camera, size, onRectReady]);

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

    // auto-aspiration : sans interaction, les objets finissent par entrer tout seuls
    if (!s.dragging && performance.now() - s.lastAt > AUTO_DELAY && s.turn < N_OBJ * ABSORB_STEP) {
      s.turn += AUTO_RATE * dt;
    }

    // aspiration progressive, un objet à la fois
    const targetCount = Math.min(N_OBJ, Math.floor(s.turn / ABSORB_STEP));
    items.current.forEach((d, i) => {
      if (i < targetCount && d.t < 1) d.t = Math.min(1, d.t + dt * 1.6);
      const e = d.t < 0.5 ? 2 * d.t * d.t : 1 - Math.pow(-2 * d.t + 2, 2) / 2;
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
        <Phone />
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
      <directionalLight position={[3, 5, 5]} intensity={1.9} />
      {/* rim light froide, par l'arrière, pour détacher les tranches */}
      <directionalLight position={[-3, 2, -4]} intensity={2.4} color="#9FC2FF" />
      <pointLight position={[-5, -1, 2]} intensity={50} color="#7B5CFF" />
      <pointLight position={[5, 3, 3]} intensity={40} color="#4FA8FF" />
      <pointLight position={[0, 0, -5]} intensity={40} color="#C05CFF" />
      <Scene ctrl={ctrl} onFacing={onFacing} onRectReady={onRectReady} />
    </Canvas>
  );
}
