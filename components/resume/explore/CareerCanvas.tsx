'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Html,
  Float,
  Sparkles,
  Environment,
  MeshTransmissionMaterial,
  useCursor,
} from '@react-three/drei';
import * as THREE from 'three';
import { AnimatePresence } from 'framer-motion';
import { TIMELINE, type TimelineNode, type ProjectHighlight } from '@/data/timeline';
import NodeDetailCard from './NodeDetailCard';

const ACCENT_HEX: Record<TimelineNode['accent'], string> = {
  blue: '#3b82f6',
  emerald: '#10b981',
  amber: '#f59e0b',
  purple: '#a855f7',
  cyan: '#06b6d4',
  rose: '#f43f5e',
};

/** Shape vocabulary per era — visual signal of role complexity. */
type ProjectShape = 'icosahedron' | 'box' | 'octahedron' | 'dodecahedron';

function getProjectShape(eraIndex: number, total: number): ProjectShape {
  // eraIndex 0 = bottom (oldest/TCS); last = top (RBC Lead)
  // Increasing geometric complexity bottom-up = increasing abstraction
  const t = eraIndex / Math.max(total - 1, 1);
  if (t < 0.25) return 'icosahedron';
  if (t < 0.5) return 'box';
  if (t < 0.75) return 'octahedron';
  return 'dodecahedron';
}

function ProjectGeometry({ shape, size = 0.32 }: { shape: ProjectShape; size?: number }) {
  switch (shape) {
    case 'icosahedron':
      return <icosahedronGeometry args={[size, 0]} />;
    case 'box':
      return <boxGeometry args={[size * 1.35, size * 1.35, size * 1.35]} />;
    case 'octahedron':
      return <octahedronGeometry args={[size * 1.15, 0]} />;
    case 'dodecahedron':
      return <dodecahedronGeometry args={[size * 1.05, 0]} />;
  }
}

/** One era — glass-transmission plane with floating project nodes + accent light. */
function EraPlane({
  era,
  eraIndex,
  total,
  y,
  onProjectClick,
}: {
  era: TimelineNode;
  eraIndex: number;
  total: number;
  y: number;
  onProjectClick: (p: ProjectHighlight) => void;
}) {
  const color = ACCENT_HEX[era.accent];
  const projects = era.projects ?? [];
  const shape = getProjectShape(eraIndex, total);

  return (
    <group position={[0, y, 0]}>
      {/* Glass plane — MeshTransmissionMaterial gives a frosted-crystal look */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9, 4.2]} />
        <MeshTransmissionMaterial
          color={color}
          thickness={0.25}
          roughness={0.18}
          transmission={0.85}
          ior={1.3}
          chromaticAberration={0.04}
          anisotropicBlur={0.1}
          distortion={0.05}
          distortionScale={0.2}
          temporalDistortion={0.08}
          attenuationColor={color}
          attenuationDistance={1.4}
          backside
          backsideThickness={0.3}
        />
      </mesh>

      {/* Accent point light anchored below plane — bathes the projects in era color */}
      <pointLight
        position={[0, -0.5, 0]}
        intensity={0.6}
        color={color}
        distance={5}
        decay={1.5}
      />

      {/* Edge frame — gives the plane definition without being hard */}
      <lineSegments rotation={[-Math.PI / 2, 0, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(9, 4.2)]} />
        <lineBasicMaterial color={color} transparent opacity={0.5} />
      </lineSegments>

      {/* Era label anchored at left edge */}
      <Html
        position={[-5.5, 0.25, 0]}
        center
        distanceFactor={10}
        className="pointer-events-none select-none"
      >
        <div className="w-44 text-right">
          <div
            className="font-mono text-[9px] font-semibold uppercase tracking-widest"
            style={{ color }}
          >
            {era.era}
          </div>
          <div className="mt-0.5 text-sm font-bold text-text-primary">
            {era.org}
          </div>
          <div className="font-mono text-[10px] text-text-tertiary">
            {era.period}
          </div>
          {era.headlineMetric && (
            <div className="mt-1 font-mono text-[11px] text-text-secondary">
              {era.headlineMetric.value}
            </div>
          )}
        </div>
      </Html>

      {/* Floating project nodes, wrapped in drei's Float for organic bob */}
      {projects.map((p, i) => {
        const spacing = 7 / Math.max(projects.length, 1);
        const x = -3.5 + spacing * (i + 0.5);
        return (
          <Float
            key={`${era.id}-${i}`}
            speed={1.4}
            rotationIntensity={0.4}
            floatIntensity={0.35}
            floatingRange={[-0.08, 0.08]}
          >
            <ProjectNode
              project={p}
              position={[x, 0.55, 0]}
              color={color}
              shape={shape}
              onClick={() => onProjectClick(p)}
            />
          </Float>
        );
      })}
    </group>
  );
}

/** A single clickable 3D project node — jewel-tone emissive, shape per era. */
function ProjectNode({
  project,
  position,
  color,
  shape,
  onClick,
}: {
  project: ProjectHighlight;
  position: [number, number, number];
  color: string;
  shape: ProjectShape;
  onClick: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useFrame(() => {
    if (!ref.current) return;
    // Slow rotation adds life
    ref.current.rotation.y += 0.005;
    ref.current.rotation.x += 0.003;
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      scale={hovered ? 1.4 : 1}
    >
      <ProjectGeometry shape={shape} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 1.1 : 0.55}
        roughness={0.15}
        metalness={0.75}
      />
      {hovered && (
        <Html
          position={[0, 0.6, 0]}
          center
          className="pointer-events-none select-none"
        >
          <div className="whitespace-nowrap rounded-md border border-border-subtle bg-surface/95 px-2 py-1 font-mono text-[10px] font-semibold text-text-primary shadow-lg backdrop-blur-sm">
            {project.name}
          </div>
        </Html>
      )}
    </mesh>
  );
}

/** Smooth camera interpolation — glides closer when a node is selected. */
function CameraController({ selected }: { selected: ProjectHighlight | null }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(11, 2, 11));

  useFrame(() => {
    // Pull in when selection open, push back when not
    if (selected) {
      target.current.set(8, 1.5, 9);
    } else {
      target.current.set(11, 2, 11);
    }
    camera.position.lerp(target.current, 0.035);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/** The full 3D scene graph. */
function SceneContents({
  selected,
  onProjectClick,
}: {
  selected: ProjectHighlight | null;
  onProjectClick: (p: ProjectHighlight) => void;
}) {
  // Chronological: TCS (bottom) → RBC Lead (top)
  const eras = [...TIMELINE].reverse();
  const spacing = 2.6;

  return (
    <>
      {/* Ambient fill + warm environment reflection for metalness */}
      <ambientLight intensity={0.35} />
      <Environment preset="sunset" background={false} blur={0.6} />

      {/* Directional key light */}
      <directionalLight
        position={[8, 12, 8]}
        intensity={0.9}
        color="#fff6eb"
      />

      {/* Era planes stacked along Y */}
      {eras.map((era, i) => {
        const y = (i - (eras.length - 1) / 2) * spacing;
        return (
          <EraPlane
            key={era.id}
            era={era}
            eraIndex={i}
            total={eras.length}
            y={y}
            onProjectClick={onProjectClick}
          />
        );
      })}

      {/* Central spine — emissive pillar threading all eras */}
      <mesh>
        <cylinderGeometry
          args={[
            0.035,
            0.035,
            (eras.length - 1) * spacing + 2.2,
            8,
          ]}
        />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffe8d2"
          emissiveIntensity={0.8}
          transparent
          opacity={0.35}
          roughness={0.3}
        />
      </mesh>

      {/* Sparkles — ambient atmosphere between eras */}
      <Sparkles
        count={100}
        scale={[14, 12, 14]}
        size={2.4}
        speed={0.25}
        color="#d4a0a7"
        opacity={0.6}
      />

      {/* Camera glide */}
      <CameraController selected={selected} />
    </>
  );
}

/**
 * Top-level 3D canvas for /resume/explore.
 *
 * Polish pass (Tier 6d-polish): MeshTransmissionMaterial on planes gives
 * a frosted-crystal look; drei's Float wraps project nodes for organic
 * bob; shape varies by era (icosahedron → box → octahedron → dodecahedron
 * bottom-up = increasing abstraction); per-era point lights tint each
 * plane's projects; Sparkles + Environment add atmosphere; CameraController
 * smoothly interpolates on selection instead of jumping.
 *
 * ExploreExperience gates viewport/reduced-motion so CareerCanvas only
 * mounts when appropriate.
 */
export default function CareerCanvas() {
  const [selected, setSelected] = useState<ProjectHighlight | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <Canvas
        camera={{ position: [11, 2, 11], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        shadows
      >
        <SceneContents selected={selected} onProjectClick={setSelected} />
        <OrbitControls
          enablePan={false}
          minDistance={6.5}
          maxDistance={22}
          minPolarAngle={Math.PI * 0.15}
          maxPolarAngle={Math.PI * 0.85}
          autoRotate={!selected}
          autoRotateSpeed={0.35}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>

      <AnimatePresence>
        {selected && (
          <NodeDetailCard project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
