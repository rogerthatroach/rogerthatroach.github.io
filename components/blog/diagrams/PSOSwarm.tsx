'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  bestX: number;
  bestY: number;
  bestVal: number;
  trail: { x: number; y: number }[];
}

// Rastrigin function for multi-modal landscape
function rastrigin(x: number, y: number): number {
  const A = 10;
  return A * 2 + (x * x - A * Math.cos(2 * Math.PI * x)) + (y * y - A * Math.cos(2 * Math.PI * y));
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function initParticles(n: number, range: number, random: () => number): Particle[] {
  return Array.from({ length: n }, () => {
    const x = (random() - 0.5) * range * 2;
    const y = (random() - 0.5) * range * 2;
    const val = rastrigin(x, y);
    return { x, y, vx: (random() - 0.5) * 2, vy: (random() - 0.5) * 2, bestX: x, bestY: y, bestVal: val, trail: [{ x, y }] };
  });
}

const PARTICLE_COUNT = 30;
const PSO_SEED = 20260801;
const HISTORY_LIMIT = 240;
const STATUS_INTERVAL = 30;
const INITIAL_BEST = Math.min(
  ...initParticles(PARTICLE_COUNT, 5.12, createSeededRandom(PSO_SEED)).map(
    (particle) => particle.bestVal
  )
);

export default function PSOSwarm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heatmapRef = useRef<ImageData | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const globalBestRef = useRef({ x: 0, y: 0, val: Infinity });
  const iterRef = useRef(0);
  const rafRef = useRef<number>(0);
  const historyRef = useRef<number[]>([]);
  const randomRef = useRef(createSeededRandom(PSO_SEED));

  const [playing, setPlaying] = useState(false);
  const [inViewport, setInViewport] = useState(true);
  const [w, setW] = useState(0.7);
  const [c1, setC1] = useState(1.5);
  const [c2, setC2] = useState(2.0);
  const [speed, setSpeed] = useState(1);
  const [runStatus, setRunStatus] = useState({
    iteration: 0,
    best: INITIAL_BEST,
  });

  const RANGE = 5.12;
  const SIZE = 400;
  const CONVERGENCE_W = 160;
  const CONVERGENCE_H = 120;

  // Pre-compute heatmap
  const computeHeatmap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const imageData = new ImageData(SIZE, SIZE);
    let maxVal = 0;
    const vals: number[] = [];
    for (let py = 0; py < SIZE; py++) {
      for (let px = 0; px < SIZE; px++) {
        const x = ((px / SIZE) - 0.5) * RANGE * 2;
        const y = ((py / SIZE) - 0.5) * RANGE * 2;
        const v = rastrigin(x, y);
        vals.push(v);
        if (v > maxVal) maxVal = v;
      }
    }
    for (let i = 0; i < vals.length; i++) {
      const norm = vals[i] / maxVal;
      const idx = i * 4;
      // Dark = low (good), bright = high (bad)
      imageData.data[idx] = Math.floor(norm * 80);
      imageData.data[idx + 1] = Math.floor(norm * 40);
      imageData.data[idx + 2] = Math.floor(20 + norm * 60);
      imageData.data[idx + 3] = 255;
    }
    heatmapRef.current = imageData;
  }, []);

  const reset = useCallback(() => {
    randomRef.current = createSeededRandom(PSO_SEED);
    particlesRef.current = initParticles(PARTICLE_COUNT, RANGE, randomRef.current);
    globalBestRef.current = { x: 0, y: 0, val: Infinity };
    iterRef.current = 0;
    historyRef.current = [];
    particlesRef.current.forEach((p) => {
      if (p.bestVal < globalBestRef.current.val) {
        globalBestRef.current = { x: p.bestX, y: p.bestY, val: p.bestVal };
      }
    });
    setRunStatus({
      iteration: 0,
      best: globalBestRef.current.val,
    });
  }, []);

  useEffect(() => { computeHeatmap(); reset(); }, [computeHeatmap, reset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => setInViewport(entry.isIntersecting),
      { threshold: 0, rootMargin: '100px' }
    );
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  const toCanvas = (v: number) => ((v / (RANGE * 2)) + 0.5) * SIZE;

  const step = useCallback(() => {
    const particles = particlesRef.current;
    const gb = globalBestRef.current;

    for (const p of particles) {
      const r1 = randomRef.current(), r2 = randomRef.current();
      p.vx = w * p.vx + c1 * r1 * (p.bestX - p.x) + c2 * r2 * (gb.x - p.x);
      p.vy = w * p.vy + c1 * r1 * (p.bestY - p.y) + c2 * r2 * (gb.y - p.y);
      // Clamp velocity
      const maxV = RANGE * 0.3;
      p.vx = Math.max(-maxV, Math.min(maxV, p.vx));
      p.vy = Math.max(-maxV, Math.min(maxV, p.vy));
      p.x += p.vx;
      p.y += p.vy;
      // Clamp position
      p.x = Math.max(-RANGE, Math.min(RANGE, p.x));
      p.y = Math.max(-RANGE, Math.min(RANGE, p.y));

      const val = rastrigin(p.x, p.y);
      if (val < p.bestVal) { p.bestX = p.x; p.bestY = p.y; p.bestVal = val; }
      if (val < gb.val) { gb.x = p.x; gb.y = p.y; gb.val = val; }

      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 20) p.trail.shift();
    }
    iterRef.current++;
    historyRef.current.push(gb.val);
    if (iterRef.current % STATUS_INTERVAL === 0) {
      setRunStatus({ iteration: iterRef.current, best: gb.val });
    }
    if (historyRef.current.length > HISTORY_LIMIT) {
      historyRef.current.splice(0, historyRef.current.length - HISTORY_LIMIT);
    }
  }, [w, c1, c2]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Heatmap
    if (heatmapRef.current) {
      ctx.putImageData(heatmapRef.current, 0, 0);
    }

    const particles = particlesRef.current;
    const gb = globalBestRef.current;

    // Trails
    for (const p of particles) {
      ctx.beginPath();
      for (let i = 0; i < p.trail.length; i++) {
        const cx = toCanvas(p.trail[i].x);
        const cy = toCanvas(p.trail[i].y);
        if (i === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      }
      ctx.strokeStyle = `rgba(212, 160, 167, ${0.3})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Particles
    for (const p of particles) {
      const cx = toCanvas(p.x);
      const cy = toCanvas(p.y);
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#d4a0a7';
      ctx.fill();
    }

    // Global best
    const gx = toCanvas(gb.x);
    const gy = toCanvas(gb.y);
    ctx.beginPath();
    ctx.arc(gx, gy, 6, 0, Math.PI * 2);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#f59e0b';
    ctx.font = '10px monospace';
    ctx.fillText('★', gx - 4, gy + 4);

    // Convergence plot (bottom-right overlay)
    const history = historyRef.current;
    if (history.length > 1) {
      const ox = SIZE - CONVERGENCE_W - 10;
      const oy = SIZE - CONVERGENCE_H - 10;
      ctx.fillStyle = 'rgba(12, 10, 10, 0.8)';
      ctx.fillRect(ox, oy, CONVERGENCE_W, CONVERGENCE_H);
      ctx.strokeStyle = 'rgba(42, 36, 36, 1)';
      ctx.strokeRect(ox, oy, CONVERGENCE_W, CONVERGENCE_H);

      ctx.fillStyle = 'rgba(168, 158, 155, 0.7)';
      ctx.font = '8px sans-serif';
      ctx.fillText('Best Value vs Iteration', ox + 4, oy + 10);

      const maxH = Math.max(...history);
      ctx.beginPath();
      for (let i = 0; i < history.length; i++) {
        const hx = ox + 5 + (i / Math.max(history.length - 1, 1)) * (CONVERGENCE_W - 10);
        const hy = oy + CONVERGENCE_H - 10 - ((1 - history[i] / maxH) * (CONVERGENCE_H - 20));
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.strokeStyle = '#d4a0a7';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#d4a0a7';
      ctx.fillText(`${gb.val.toFixed(4)}`, ox + 4, oy + CONVERGENCE_H - 4);
    }

    // Info overlay
    ctx.fillStyle = 'rgba(12, 10, 10, 0.7)';
    ctx.fillRect(5, 5, 120, 24);
    ctx.fillStyle = '#f0ebe8';
    ctx.font = '10px monospace';
    ctx.fillText(`Iter: ${iterRef.current}  Best: ${gb.val.toFixed(3)}`, 10, 21);
  }, []);

  // Animation loop
  useEffect(() => {
    if (!playing || !inViewport) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    let frameCount = 0;
    const loop = () => {
      frameCount++;
      if (frameCount % Math.max(1, 4 - speed) === 0) {
        step();
      }
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, inViewport, step, draw, speed]);

  // Draw initial state
  useEffect(() => { draw(); }, [draw]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <p id="pso-simulation-description" className="text-xs text-text-tertiary">
        Deterministic, seeded particle-swarm illustration over the two-dimensional Rastrigin test function.
        The star marks the best sampled point found so far; it does not imply a global-optimum guarantee.
      </p>

      <noscript>
        <p className="rounded-lg border border-border-subtle bg-surface p-3 text-xs leading-relaxed text-text-secondary">
          Static description: thirty seeded particles explore a bounded two-dimensional test surface. Each
          particle updates from its own best sampled point and the swarm&apos;s best sampled point. The display
          illustrates search behavior only; it neither proves convergence nor replaces the plant-operator
          review described in the article.
        </p>
      </noscript>

      {/* Canvas */}
      <canvas
        id="pso-simulation-canvas"
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        role="img"
        aria-label="Particle positions and trails on a Rastrigin test-function heatmap"
        aria-describedby="pso-simulation-description pso-simulation-status"
        className="mx-auto w-full max-w-[400px] rounded-lg"
        style={{ imageRendering: 'pixelated' }}
      >
        A seeded particle-swarm illustration. Use the controls below to play, pause, tune, or reset it.
      </canvas>

      <output
        id="pso-simulation-status"
        aria-live="polite"
        className="text-center font-mono text-xs text-text-secondary"
      >
        Iteration {runStatus.iteration}; best sampled objective {runStatus.best.toFixed(4)}.
      </output>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <label htmlFor="pso-inertia" className="text-[10px] text-text-tertiary">Inertia w: {w.toFixed(2)}</label>
          <input id="pso-inertia" type="range" min={0.2} max={1} step={0.05} value={w} onChange={(e) => setW(Number(e.target.value))} className="w-full" />
        </div>
        <div>
          <label htmlFor="pso-cognitive" className="text-[10px] text-text-tertiary">Cognitive c₁: {c1.toFixed(1)}</label>
          <input id="pso-cognitive" type="range" min={0} max={3} step={0.1} value={c1} onChange={(e) => setC1(Number(e.target.value))} className="w-full" />
        </div>
        <div>
          <label htmlFor="pso-social" className="text-[10px] text-text-tertiary">Social c₂: {c2.toFixed(1)}</label>
          <input id="pso-social" type="range" min={0} max={3} step={0.1} value={c2} onChange={(e) => setC2(Number(e.target.value))} className="w-full" />
        </div>
        <div>
          <label htmlFor="pso-speed" className="text-[10px] text-text-tertiary">Playback speed: {speed}×</label>
          <input id="pso-speed" type="range" min={1} max={3} step={1} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            if (playing) {
              setRunStatus({
                iteration: iterRef.current,
                best: globalBestRef.current.val,
              });
            }
            setPlaying(!playing);
          }}
          aria-pressed={playing}
          aria-controls="pso-simulation-canvas"
          className="rounded-md bg-accent px-4 py-1.5 text-xs font-medium text-white"
        >
          {playing ? 'Pause' : 'Play'}
        </button>
        <button
          type="button"
          onClick={() => { reset(); draw(); }}
          aria-controls="pso-simulation-canvas"
          className="rounded-md bg-surface px-4 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-hover"
        >
          Reset
        </button>
        <span className="flex items-center text-[10px] text-text-tertiary">
          {PARTICLE_COUNT} particles · seed {PSO_SEED}
        </span>
      </div>
    </div>
  );
}
