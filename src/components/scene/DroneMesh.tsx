"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

/** Lightweight 3D quadcopter above the Saudi map. */
export function DroneMesh({
  position = [0.45, 1.2, 0.15] as [number, number, number],
}) {
  const group = useRef<Group>(null);
  const propsRef = useRef<Group>(null);

  useFrame((_, dt) => {
    if (group.current) {
      group.current.position.y =
        position[1] + Math.sin(performance.now() * 0.0016) * 0.08;
    }
    if (propsRef.current) {
      for (let i = 0; i < propsRef.current.children.length; i++) {
        propsRef.current.children[i].rotation.y += dt * (i % 2 === 0 ? 30 : -30);
      }
    }
  });

  const motors: [number, number, number][] = [
    [0.42, 0.08, 0.42],
    [-0.42, 0.08, 0.42],
    [0.42, 0.08, -0.42],
    [-0.42, 0.08, -0.42],
  ];

  return (
    <group ref={group} position={position} scale={0.52}>
      <mesh castShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[0.4, 0.12, 0.4]} />
        <meshStandardMaterial color="#f4f7f9" roughness={0.35} metalness={0.2} />
      </mesh>
      <mesh castShadow position={[0, 0.14, 0]}>
        <sphereGeometry args={[0.11, 24, 16]} />
        <meshStandardMaterial
          color="#2eb8b0"
          roughness={0.2}
          metalness={0.35}
          emissive="#2eb8b0"
          emissiveIntensity={0.28}
        />
      </mesh>

      {motors.map((pos, i) => (
        <mesh
          key={`arm-${i}`}
          castShadow
          position={[pos[0] / 2, 0.06, pos[2] / 2]}
          rotation={[0, Math.atan2(pos[0], pos[2]), 0]}
        >
          <boxGeometry args={[0.06, 0.035, 0.55]} />
          <meshStandardMaterial color="#d7e0e6" roughness={0.45} metalness={0.15} />
        </mesh>
      ))}

      <group ref={propsRef}>
        {motors.map((pos, i) => (
          <group key={`motor-${i}`} position={pos}>
            <mesh castShadow>
              <cylinderGeometry args={[0.065, 0.065, 0.05, 16]} />
              <meshStandardMaterial color="#eef3f6" metalness={0.3} roughness={0.3} />
            </mesh>
            <mesh>
              <torusGeometry args={[0.2, 0.016, 10, 32]} />
              <meshStandardMaterial
                color="#2eb8b0"
                emissive="#2eb8b0"
                emissiveIntensity={0.55}
                roughness={0.25}
              />
            </mesh>
            <mesh>
              <boxGeometry args={[0.38, 0.01, 0.045]} />
              <meshStandardMaterial color="#1a8a84" transparent opacity={0.55} />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[0.38, 0.01, 0.045]} />
              <meshStandardMaterial color="#2eb8b0" transparent opacity={0.4} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
