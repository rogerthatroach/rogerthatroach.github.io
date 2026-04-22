'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/*
  Sakura-inspired particle field.
  Soft drifting particles — some warm (petal-like), some cool (structural).
  Motion is organic: gentle tumble, slight curl, never mechanical.
  Scroll shifts the camera — parallax depth.
  Power below the surface: most particles are barely visible,
  a few catch light and glow briefly.
*/

const PARTICLE_COUNT = 500;

// Warm/cool color palette — wabi-sabi: muted, works on both light and dark
const COLORS = [
  new THREE.Color('#c4848c'), // dusty rose (deeper)
  new THREE.Color('#b07a82'), // sakura (accent-matched)
  new THREE.Color('#8a9bb0'), // blue-grey
  new THREE.Color('#7a8a9c'), // cool slate
  new THREE.Color('#a89880'), // warm sand
  new THREE.Color('#6b5e54'), // earth
];

function ScrollCamera() {
  const { camera } = useThree();
  const scrollRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = window.scrollY / window.innerHeight;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useFrame(() => {
    const t = scrollRef.current;
    camera.position.y = -t * 1.5;
    camera.position.z = 5 + t * 0.3;
    // Gentle lateral drift
    camera.position.x = Math.sin(t * 0.5) * 0.3;
  });

  return null;
}

function Particles() {
  const meshRef = useRef<THREE.Points>(null);

  const [positions, velocities, phases, colorIndices] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);
    const pha = new Float32Array(PARTICLE_COUNT); // phase offset for organic motion
    const col = new Uint8Array(PARTICLE_COUNT); // color index
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      // Drift: mostly downward and slightly lateral — like falling petals
      vel[i * 3] = (Math.random() - 0.5) * 0.001;
      vel[i * 3 + 1] = -0.0005 - Math.random() * 0.001; // gentle fall
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.0005;
      pha[i] = Math.random() * Math.PI * 2;
      col[i] = Math.floor(Math.random() * COLORS.length);
    }
    return [pos, vel, pha, col];
  }, []);

  // Build color attribute
  const colors = useMemo(() => {
    const c = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const color = COLORS[colorIndices[i]];
      c[i * 3] = color.r;
      c[i * 3 + 1] = color.g;
      c[i * 3 + 2] = color.b;
    }
    return c;
  }, [colorIndices]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const posArray = meshRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phase = phases[i];
      // Organic curl — like a petal tumbling in air
      const curl = Math.sin(t * 0.4 + phase) * 0.0008;
      const sway = Math.cos(t * 0.3 + phase * 1.3) * 0.0005;

      posArray[i * 3] += velocities[i * 3] + curl;
      posArray[i * 3 + 1] += velocities[i * 3 + 1];
      posArray[i * 3 + 2] += velocities[i * 3 + 2] + sway;

      // Wrap — seamless
      for (let j = 0; j < 3; j++) {
        const bound = j === 2 ? 5 : 8;
        if (posArray[i * 3 + j] > bound) posArray[i * 3 + j] = -bound;
        if (posArray[i * 3 + j] < -bound) posArray[i * 3 + j] = bound;
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticleField() {
  const [visible, setVisible] = useState(true);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    // Detect WebGL availability up-front — headless Chrome under --disable-gpu
    // (Lighthouse, some CI envs) returns null here, and letting Three.js crash
    // downstream surfaces console errors that Lighthouse counts against BP +
    // cascades into DOM-query audits (viewport / title / lang / meta-description
    // were reporting as missing even though the server HTML carried them).
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl');
      if (!gl) setSupported(false);
    } catch {
      setSupported(false);
    }

    // Gate on both prefers-reduced-motion AND viewport ≥ md (768 px).
    // The ~80 KB Three.js + continuous Canvas render is heavy for a
    // decorative background on mobile — desktop gets the sakura drift,
    // mobile gets the clean hero.
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktopMq = window.matchMedia('(min-width: 768px)');
    const update = () => setVisible(desktopMq.matches && !reducedMq.matches);
    update();
    reducedMq.addEventListener('change', update);
    desktopMq.addEventListener('change', update);
    return () => {
      reducedMq.removeEventListener('change', update);
      desktopMq.removeEventListener('change', update);
    };
  }, []);

  if (!visible || !supported) return null;

  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
        style={{ background: 'transparent' }}
      >
        <ScrollCamera />
        <Particles />
      </Canvas>
    </div>
  );
}
