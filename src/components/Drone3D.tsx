"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

function FancyDrone() {
  const root = useRef<Group>(null);
  const props = useRef<Group>(null);

  useFrame((_, dt) => {
    if (root.current) {
      const t = performance.now() * 0.001;
      root.current.position.y = Math.sin(t * 1.6) * 0.12;
      root.current.rotation.y = Math.sin(t * 0.55) * 0.35;
      root.current.rotation.x = 0.28 + Math.sin(t * 0.9) * 0.06;
      root.current.rotation.z = Math.sin(t * 0.7) * 0.08;
    }
    if (props.current) {
      for (let i = 0; i < props.current.children.length; i++) {
        props.current.children[i].rotation.y += dt * (i % 2 === 0 ? 36 : -36);
      }
    }
  });

  const motors: [number, number, number][] = [
    [0.55, 0.1, 0.55],
    [-0.55, 0.1, 0.55],
    [0.55, 0.1, -0.55],
    [-0.55, 0.1, -0.55],
  ];

  return (
    <group ref={root} scale={1.05}>
      {/* Main body — layered for depth */}
      <mesh castShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[0.55, 0.16, 0.55]} />
        <meshStandardMaterial color="#F2F7F6" roughness={0.28} metalness={0.25} />
      </mesh>
      <mesh castShadow position={[0, 0.12, 0]}>
        <boxGeometry args={[0.4, 0.08, 0.4]} />
        <meshStandardMaterial color="#e8eef2" roughness={0.35} metalness={0.15} />
      </mesh>

      {/* Glass canopy */}
      <mesh castShadow position={[0, 0.2, 0.02]}>
        <sphereGeometry args={[0.16, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial
          color="#0B4A45"
          roughness={0.12}
          metalness={0.55}
          emissive="#0B4A45"
          emissiveIntensity={0.25}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Status LEDs */}
      <mesh position={[0.2, 0.12, 0.28]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial
          color="#B8944F"
          emissive="#B8944F"
          emissiveIntensity={1.2}
        />
      </mesh>
      <mesh position={[-0.2, 0.12, 0.28]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial
          color="#A9D4CD"
          emissive="#A9D4CD"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Camera gimbal */}
      <mesh position={[0, -0.05, 0.28]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 0.08, 16]} />
        <meshStandardMaterial color="#6b7c89" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.08, 0.34]}>
        <sphereGeometry args={[0.04, 16, 12]} />
        <meshStandardMaterial color="#0B4A45" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Arms */}
      {motors.map((pos, i) => (
        <mesh
          key={`arm-${i}`}
          castShadow
          position={[pos[0] / 2, 0.08, pos[2] / 2]}
          rotation={[0, Math.atan2(pos[0], pos[2]), 0]}
        >
          <boxGeometry args={[0.08, 0.045, 0.72]} />
          <meshStandardMaterial color="#dce5eb" roughness={0.4} metalness={0.2} />
        </mesh>
      ))}

      {/* Landing gear */}
      <mesh position={[0.18, -0.12, 0.18]} rotation={[0.35, 0, -0.25]}>
        <cylinderGeometry args={[0.015, 0.015, 0.28, 8]} />
        <meshStandardMaterial color="#8a9aa5" />
      </mesh>
      <mesh position={[-0.18, -0.12, 0.18]} rotation={[0.35, 0, 0.25]}>
        <cylinderGeometry args={[0.015, 0.015, 0.28, 8]} />
        <meshStandardMaterial color="#8a9aa5" />
      </mesh>
      <mesh position={[0.18, -0.12, -0.1]} rotation={[-0.2, 0, -0.25]}>
        <cylinderGeometry args={[0.015, 0.015, 0.22, 8]} />
        <meshStandardMaterial color="#8a9aa5" />
      </mesh>
      <mesh position={[-0.18, -0.12, -0.1]} rotation={[-0.2, 0, 0.25]}>
        <cylinderGeometry args={[0.015, 0.015, 0.22, 8]} />
        <meshStandardMaterial color="#8a9aa5" />
      </mesh>

      {/* Motors + spinning propellers */}
      <group ref={props}>
        {motors.map((pos, i) => (
          <group key={`motor-${i}`} position={pos}>
            <mesh castShadow>
              <cylinderGeometry args={[0.09, 0.09, 0.07, 20]} />
              <meshStandardMaterial color="#f4f7f9" metalness={0.35} roughness={0.25} />
            </mesh>
            <mesh>
              <torusGeometry args={[0.28, 0.022, 12, 40]} />
              <meshStandardMaterial
                color="#B8944F"
                emissive="#B8944F"
                emissiveIntensity={0.55}
                roughness={0.2}
                metalness={0.4}
              />
            </mesh>
            {/* Motion blur disc */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.26, 32]} />
              <meshStandardMaterial
                color="#B8944F"
                transparent
                opacity={0.12}
                roughness={1}
              />
            </mesh>
            <mesh>
              <boxGeometry args={[0.5, 0.012, 0.055]} />
              <meshStandardMaterial color="#0B4A45" transparent opacity={0.65} />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[0.5, 0.012, 0.055]} />
              <meshStandardMaterial color="#B8944F" transparent opacity={0.45} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

export function Drone3D() {
  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute left-1/2 top-[55%] h-[45%] w-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(28,60,72,0.22),transparent_70%)] blur-md" />
      <Canvas
        className="h-full w-full"
        dpr={[1, 1.75]}
        camera={{ position: [1.6, 1.35, 2.1], fov: 35, near: 0.1, far: 20 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 5, 2]} intensity={1.4} castShadow />
        <directionalLight position={[-2, 2, -1]} intensity={0.4} color="#9fd9d4" />
        <FancyDrone />
        <ContactShadows
          position={[0, -0.55, 0]}
          opacity={0.35}
          scale={4}
          blur={2.5}
          far={3}
        />
        <Environment preset="city" environmentIntensity={0.4} />
      </Canvas>
    </div>
  );
}
