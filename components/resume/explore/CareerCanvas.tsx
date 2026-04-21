'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, useCursor } from '@react-three/drei';
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

/** One era rendered as a floating frame + project nodes in 3D space. */
function EraPlane({
  era,
  y,
  onProjectClick,
}: {
  era: TimelineNode;
  y: number;
  onProjectClick: (p: ProjectHighlight) => void;
}) {
  const color = ACCENT_HEX[era.accent];
  const projects = era.projects ?? [];

  return (
    <group position={[0, y, 0]}>
      {/* Transparent plane — establishes the "floor" of the era */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[9, 4]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
          roughness={0.9}
        />
      </mesh>

      {/* Frame edge — gives the plane definition */}
      <lineSegments rotation={[-Math.PI / 2, 0, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(9, 4)]} />
        <lineBasicMaterial color={color} transparent opacity={0.7} />
      </lineSegments>

      {/* Era label — HTML overlay anchored at left edge of plane */}
      <Html
        position={[-5.5, 0.2, 0]}
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

      {/* Project nodes — arranged in a row in front of the plane */}
      {projects.map((p, i) => {
        const spacing = 7 / Math.max(projects.length, 1);
        const x = -3.5 + spacing * (i + 0.5);
        return (
          <ProjectNode
            key={`${era.id}-${i}`}
            project={p}
            position={[x, 0.4, 0]}
            color={color}
            onClick={() => onProjectClick(p)}
          />
        );
      })}
    </group>
  );
}

/** A single clickable 3D project node with hover/float. */
function ProjectNode({
  project,
  position,
  color,
  onClick,
}: {
  project: ProjectHighlight;
  position: [number, number, number];
  color: string;
  onClick: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    // Gentle bob
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.6 + position[0]) * 0.06;
    ref.current.rotation.y += 0.006;
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
      scale={hovered ? 1.35 : 1}
    >
      <sphereGeometry args={[0.28, 24, 24]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 0.7 : 0.35}
        roughness={0.3}
        metalness={0.4}
      />
      {hovered && (
        <Html position={[0, 0.55, 0]} center className="pointer-events-none select-none">
          <div className="whitespace-nowrap rounded-md border border-border-subtle bg-surface px-2 py-1 font-mono text-[10px] font-semibold text-text-primary shadow-lg">
            {project.name}
          </div>
        </Html>
      )}
    </mesh>
  );
}

/** Scene graph — 4 eras stacked vertically along Y, lit from above-left. */
function SceneContents({
  onProjectClick,
}: {
  onProjectClick: (p: ProjectHighlight) => void;
}) {
  // Chronological: TCS (bottom) → RBC Lead (top)
  const eras = [...TIMELINE].reverse();
  const spacing = 2.4;

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 10, 6]} intensity={0.9} castShadow />
      <pointLight position={[-6, 4, 4]} intensity={0.4} color="#d4a0a7" />

      {eras.map((era, i) => {
        const y = (i - (eras.length - 1) / 2) * spacing;
        return (
          <EraPlane
            key={era.id}
            era={era}
            y={y}
            onProjectClick={onProjectClick}
          />
        );
      })}

      {/* Central vertical spine connecting all eras */}
      <mesh>
        <cylinderGeometry
          args={[
            0.02,
            0.02,
            (eras.length - 1) * spacing + 1.5,
            8,
          ]}
        />
        <meshBasicMaterial color="#888888" transparent opacity={0.25} />
      </mesh>
    </>
  );
}

/**
 * Top-level 3D canvas for /resume/explore.
 *
 * Only mounted on viewports ≥ 900px and when reduced-motion is NOT set
 * (ExploreExperience gates this). Orbit controls enabled; auto-rotate
 * gives the scene life until the user takes control.
 *
 * Escape key closes any open detail card.
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
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        shadows
      >
        <SceneContents onProjectClick={setSelected} />
        <OrbitControls
          enablePan={false}
          minDistance={7}
          maxDistance={22}
          minPolarAngle={Math.PI * 0.15}
          maxPolarAngle={Math.PI * 0.85}
          autoRotate={!selected}
          autoRotateSpeed={0.4}
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
