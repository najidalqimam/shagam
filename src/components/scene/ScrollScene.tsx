"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { DroneMesh } from "./DroneMesh";
import { SaudiMapMesh } from "./SaudiMapMesh";

type ScrollSceneProps = {
  progressRef: React.MutableRefObject<number>;
};

function CameraRig({ progressRef }: ScrollSceneProps) {
  const { camera } = useThree();
  const current = useRef(0);

  // Key camera angles around the Saudi map (spherical-ish orbit)
  const shots = useMemo(
    () => [
      { pos: new THREE.Vector3(3.8, 3.2, 4.6), look: new THREE.Vector3(0.2, 0.2, 0) },
      { pos: new THREE.Vector3(-1.2, 4.4, 5.2), look: new THREE.Vector3(0.1, 0.15, 0) },
      { pos: new THREE.Vector3(-5.0, 3.0, 1.4), look: new THREE.Vector3(0, 0.2, 0) },
      { pos: new THREE.Vector3(-2.4, 5.6, -3.8), look: new THREE.Vector3(0.15, 0.1, 0) },
      { pos: new THREE.Vector3(4.2, 2.4, -4.0), look: new THREE.Vector3(0, 0.25, 0) },
      { pos: new THREE.Vector3(0.6, 7.2, 0.8), look: new THREE.Vector3(0, 0, 0) },
    ],
    [],
  );

  const tmpPos = useMemo(() => new THREE.Vector3(), []);
  const tmpLook = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    current.current = THREE.MathUtils.damp(
      current.current,
      progressRef.current,
      6,
      0.016,
    );

    const p = Math.min(Math.max(current.current, 0), 0.999);
    const scaled = p * (shots.length - 1);
    const i = Math.floor(scaled);
    const t = scaled - i;
    const a = shots[i];
    const b = shots[Math.min(i + 1, shots.length - 1)];

    tmpPos.lerpVectors(a.pos, b.pos, t);
    tmpLook.lerpVectors(a.look, b.look, t);
    camera.position.copy(tmpPos);
    camera.lookAt(tmpLook);
  });

  return null;
}

function MapTurntable({ progressRef }: ScrollSceneProps) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    const p = progressRef.current;
    // Extra yaw/pitch so the kingdom is seen from new sides while scrolling
    ref.current.rotation.y = THREE.MathUtils.lerp(0.15, -Math.PI * 1.15, p);
    ref.current.rotation.x = THREE.MathUtils.lerp(
      0.08,
      -0.12,
      Math.sin(p * Math.PI),
    );
    ref.current.position.y = THREE.MathUtils.lerp(0, -0.15, p);
  });

  return (
    <group ref={ref}>
      <SaudiMapMesh />
      <DroneMesh />
    </group>
  );
}

export function ScrollScene({ progressRef }: ScrollSceneProps) {
  return (
    <Canvas
      className="h-full w-full"
      dpr={[1, 1.75]}
      camera={{ position: [3.8, 3.2, 4.6], fov: 42, near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.25}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-4, 3, -2]} intensity={0.35} color="#9fd9d4" />

      <CameraRig progressRef={progressRef} />
      <MapTurntable progressRef={progressRef} />

      <ContactShadows
        position={[0, -0.02, 0]}
        opacity={0.28}
        scale={12}
        blur={2.8}
        far={6}
      />
      <Environment preset="city" environmentIntensity={0.35} />
    </Canvas>
  );
}
