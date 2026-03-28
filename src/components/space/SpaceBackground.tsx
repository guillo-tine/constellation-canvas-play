import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, MeshDistortMaterial } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Planet({
  position,
  size,
  color,
  emissive,
  speed = 0.3,
  distort = 0.3,
}: {
  position: [number, number, number];
  size: number;
  color: string;
  emissive: string;
  speed?: number;
  distort?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.002 * speed;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
  });

  return (
    <Float speed={speed} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.4}
          roughness={0.7}
          metalness={0.3}
          distort={distort}
          speed={2}
        />
      </mesh>
      {/* Ring for some planets */}
      {size > 0.8 && (
        <mesh position={position} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[size * 1.6, 0.04, 16, 100]} />
          <meshStandardMaterial
            color={emissive}
            emissive={emissive}
            emissiveIntensity={0.8}
            transparent
            opacity={0.4}
          />
        </mesh>
      )}
    </Float>
  );
}

function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#a855f7" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function Nebula({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.01;
    const s = 1 + Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    ref.current.scale.set(s, s, s);
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[3, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.15}
        transparent
        opacity={0.08}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function SpaceBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.15} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#a855f7" />
        <pointLight position={[-10, -5, 5]} intensity={0.3} color="#3b82f6" />
        <pointLight position={[5, -10, -5]} intensity={0.2} color="#ec4899" />

        <Stars radius={50} depth={80} count={3000} factor={3} saturation={0.8} fade speed={0.5} />

        <Planet position={[-5, 3, -8]} size={1.2} color="#7c3aed" emissive="#a855f7" speed={0.5} distort={0.25} />
        <Planet position={[6, -2, -12]} size={1.8} color="#1e3a5f" emissive="#3b82f6" speed={0.2} distort={0.15} />
        <Planet position={[-3, -4, -6]} size={0.6} color="#831843" emissive="#ec4899" speed={0.8} distort={0.4} />
        <Planet position={[4, 4, -15]} size={0.9} color="#4c1d95" emissive="#8b5cf6" speed={0.35} distort={0.2} />
        <Planet position={[-7, 0, -10]} size={0.4} color="#164e63" emissive="#06b6d4" speed={1} distort={0.5} />

        <Nebula position={[3, 2, -20]} color="#7c3aed" />
        <Nebula position={[-5, -3, -18]} color="#1e40af" />

        <FloatingParticles />
      </Canvas>
    </div>
  );
}
