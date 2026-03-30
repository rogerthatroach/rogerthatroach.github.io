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

function initParticles(n: number, range: number): Particle[] {
  return Array.from({ length: n }, () => {
    const x = (Math.random() - 0.5) * range * 2;
    const y = (Math.random() - 0.5) * range * 2;
    const val = rastrigin(x, y);
    return { x, y, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2, bestX: x, bestY: y, bestVal: val, trail: [{ x, y }] };
  });
}

export default function PSOSwarm({ isVisible }: { isVisible?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heatmapRef = useRef<ImageData | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const globalBestRef = useRef({ x: 0, y: 0, val: Infinity });
  const iterRef = useRef(0);
  const rafRef = useRef<number>(0);
  const historyRef = useRef<number[]>([]);

  const [playing, setPlaying] = useState(false);
  const [w, setW] = useState(0.7);
  const [c1, setC1] = useState(1.5);
  const [c2, setC2] = useState(2.0);
  const [N, setN] = useState(30);
  const [speed, setSpeed] = useState(1);

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
    particlesRef.current = initParticles(N, RANGE);
    globalBestRef.current = { x: 0, y: 0, val: Infinity };
    iterRef.current = 0;
    historyRef.current = [];
    particlesRef.current.forEach((p) => {
      if (p.bestVal < globalBestRef.current.val) {
        globalBestRef.current = { x: p.bestX, y: p.bestY, val: p.bestVal };
      }
    });
  }, [N]);

  useEffect(() => { computeHeatmap(); reset(); }, [computeHeatmap, reset]);

  const toCanvas = (v: number) => ((v / (RANGE * 2)) + 0.5) * SIZE;

  const step = useCallback(() => {
    const particles = particlesRef.current;
    const gb = globalBestRef.current;

    for (const p of particles) {
      const r1 = Math.random(), r2 = Math.random();
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
    if (!playing || isVisible === false) {
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
  }, [playing, isVisible, step, draw, speed]);

  // Draw initial state
  useEffect(() => { draw(); }, [draw]);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        className="mx-auto w-full max-w-[400px] rounded-lg"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <label className="text-[10px] text-text-tertiary">Inertia w: {w.toFixed(2)}</label>
          <input type="range" min={0.2} max={1} step={0.05} value={w} onChange={(e) => setW(Number(e.target.value))} className="w-full" />
        </div>
        <div>
          <label className="text-[10px] text-text-tertiary">Cognitive c₁: {c1.toFixed(1)}</label>
          <input type="range" min={0} max={3} step={0.1} value={c1} onChange={(e) => setC1(Number(e.target.value))} className="w-full" />
        </div>
        <div>
          <label className="text-[10px] text-text-tertiary">Social c₂: {c2.toFixed(1)}</label>
          <input type="range" min={0} max={3} step={0.1} value={c2} onChange={(e) => setC2(Number(e.target.value))} className="w-full" />
        </div>
        <div>
          <label className="text-[10px] text-text-tertiary">Speed: {speed}x</label>
          <input type="range" min={1} max={3} step={1} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full" />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setPlaying(!playing)}
          className="rounded-md bg-accent px-4 py-1.5 text-xs font-medium text-white"
        >
          {playing ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={() => { reset(); draw(); }}
          className="rounded-md bg-surface px-4 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-hover"
        >
          Reset
        </button>
        <span className="flex items-center text-[10px] text-text-tertiary">
          N = {N} particles on Rastrigin function
        </span>
      </div>
    </div>
  );
}
