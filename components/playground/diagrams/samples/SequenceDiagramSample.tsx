'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * UML-style sequence diagram. 4 lifelines (vertical participants), 9
 * messages (horizontal arrows) showing a synthetic request flow.
 *
 * When to use: showing temporal message flow between actors with precise
 * ordering. Good for API walk-throughs, multi-step authentication,
 * LangGraph state transitions, distributed system call graphs.
 */

const ACTORS = [
  { id: 'user', label: 'User', x: 90 },
  { id: 'api', label: 'API', x: 280 },
  { id: 'llm', label: 'LLM', x: 470 },
  { id: 'db', label: 'DB', x: 620 },
];

const MESSAGES: {
  from: string;
  to: string;
  label: string;
  y: number;
  type: 'sync' | 'return' | 'async';
  annotation?: string;
}[] = [
  { from: 'user', to: 'api', label: 'POST /draft', y: 70, type: 'sync' },
  { from: 'api', to: 'llm', label: 'parse(query)', y: 110, type: 'sync' },
  { from: 'llm', to: 'api', label: 'intent + fields', y: 140, type: 'return', annotation: 'structured' },
  { from: 'api', to: 'db', label: 'lookup template', y: 180, type: 'sync' },
  { from: 'db', to: 'api', label: 'template_v12', y: 210, type: 'return' },
  { from: 'api', to: 'llm', label: 'fill(template, fields)', y: 250, type: 'sync' },
  { from: 'llm', to: 'db', label: 'retrieve(scope)', y: 280, type: 'async', annotation: 'async' },
  { from: 'llm', to: 'api', label: 'draft text', y: 320, type: 'return' },
  { from: 'api', to: 'user', label: '200 OK + draft', y: 360, type: 'return' },
];

const W = 720;
const H = 420;

export default function SequenceDiagramSample() {
  const reduceMotion = useReducedMotion();
  const actorByX = Object.fromEntries(ACTORS.map((a) => [a.id, a.x]));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Sequence diagram with 4 actors (User, API, LLM, DB) and 9 messages showing a PAR draft request lifecycle."
    >
      {/* Actor headers */}
      {ACTORS.map((actor) => (
        <g key={actor.id}>
          <rect
            x={actor.x - 45}
            y={15}
            width={90}
            height={28}
            fill="var(--color-surface)"
            stroke="var(--color-border)"
            strokeWidth={1}
            rx={4}
          />
          <text
            x={actor.x}
            y={33}
            fontSize={12}
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontFamily="var(--font-inter), Inter, sans-serif"
            fontWeight={600}
          >
            {actor.label}
          </text>
          {/* Lifeline (vertical dashed) */}
          <line
            x1={actor.x}
            y1={43}
            x2={actor.x}
            y2={H - 20}
            stroke="var(--color-border)"
            strokeOpacity={0.7}
            strokeDasharray="3 4"
          />
        </g>
      ))}

      {/* Messages */}
      {MESSAGES.map((msg, i) => {
        const x1 = actorByX[msg.from];
        const x2 = actorByX[msg.to];
        const isReturn = msg.type === 'return';
        const isAsync = msg.type === 'async';
        const dir = x2 > x1 ? 1 : -1;
        const arrowEnd = x2 - dir * 3;
        return (
          <motion.g
            key={`m-${i}`}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
          >
            <line
              x1={x1}
              y1={msg.y}
              x2={arrowEnd}
              y2={msg.y}
              stroke={isReturn ? 'var(--color-text-tertiary)' : 'var(--color-accent)'}
              strokeWidth={isReturn ? 1.2 : 1.8}
              strokeDasharray={isReturn || isAsync ? '5 3' : undefined}
            />
            {/* Arrow head */}
            <polygon
              points={`${arrowEnd},${msg.y} ${arrowEnd - dir * 7},${msg.y - 4} ${arrowEnd - dir * 7},${msg.y + 4}`}
              fill={isReturn ? 'var(--color-text-tertiary)' : 'var(--color-accent)'}
            />
            {/* Label */}
            <text
              x={(x1 + x2) / 2}
              y={msg.y - 6}
              fontSize={11}
              textAnchor="middle"
              fill={isReturn ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)'}
              fontFamily="var(--font-jetbrains), JetBrains Mono, monospace"
            >
              {msg.label}
            </text>
            {msg.annotation && (
              <text
                x={(x1 + x2) / 2}
                y={msg.y + 14}
                fontSize={9}
                textAnchor="middle"
                fill="var(--color-text-tertiary)"
                fontFamily="var(--font-jetbrains), JetBrains Mono, monospace"
                fontStyle="italic"
              >
                {msg.annotation}
              </text>
            )}
          </motion.g>
        );
      })}
    </svg>
  );
}
