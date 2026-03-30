'use client';

import { motion } from 'framer-motion';

const FADE_IN = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } };

export default function AgenticArchitecture() {
  return (
    <div className="flex flex-col items-center gap-8 p-6 sm:flex-row sm:items-start sm:justify-center sm:gap-12">
      {/* Monolithic */}
      <motion.div {...FADE_IN} transition={{ delay: 0.2 }} className="w-full max-w-[280px]">
        <h4 className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-red-400">
          Monolithic LLM
        </h4>
        <svg viewBox="0 0 240 260" className="w-full" fill="none">
          {/* Query */}
          <rect x="70" y="10" width="100" height="32" rx="6" className="fill-surface stroke-border-subtle" strokeWidth="1" />
          <text x="120" y="30" textAnchor="middle" className="fill-text-secondary" fontSize="10">NL Query</text>
          {/* Arrow */}
          <line x1="120" y1="42" x2="120" y2="62" className="stroke-text-tertiary" strokeWidth="1" markerEnd="url(#arrow-red)" />
          {/* LLM Box - large */}
          <rect x="30" y="62" width="180" height="80" rx="8" className="fill-red-500/10 stroke-red-400/50" strokeWidth="1.5" strokeDasharray="4 2" />
          <text x="120" y="88" textAnchor="middle" className="fill-text-primary" fontSize="11" fontWeight="600">Single LLM</text>
          <text x="120" y="104" textAnchor="middle" className="fill-text-tertiary" fontSize="9">Query + Data + Computation</text>
          <text x="120" y="118" textAnchor="middle" className="fill-text-tertiary" fontSize="9">All in one context window</text>
          {/* Arrow */}
          <line x1="120" y1="142" x2="120" y2="162" className="stroke-text-tertiary" strokeWidth="1" />
          {/* Output */}
          <rect x="60" y="162" width="120" height="32" rx="6" className="fill-surface stroke-border-subtle" strokeWidth="1" />
          <text x="120" y="182" textAnchor="middle" className="fill-text-secondary" fontSize="10">Response</text>
          {/* Failure marks */}
          <text x="218" y="80" className="fill-red-400" fontSize="14" fontWeight="bold">✗</text>
          <text x="218" y="98" className="fill-red-400" fontSize="8">Non-deterministic</text>
          <text x="218" y="112" className="fill-red-400" fontSize="14" fontWeight="bold">✗</text>
          <text x="218" y="130" className="fill-red-400" fontSize="8">Data exposed</text>
          {/* Arrow marker */}
          <defs>
            <marker id="arrow-red" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" className="fill-text-tertiary" />
            </marker>
          </defs>
        </svg>
      </motion.div>

      {/* Divider */}
      <div className="hidden h-64 w-px bg-border-subtle sm:block" />

      {/* LLM-as-Router */}
      <motion.div {...FADE_IN} transition={{ delay: 0.5 }} className="w-full max-w-[280px]">
        <h4 className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-green-400">
          LLM-as-Router
        </h4>
        <svg viewBox="0 0 240 300" className="w-full" fill="none">
          {/* Query */}
          <rect x="70" y="10" width="100" height="32" rx="6" className="fill-surface stroke-border-subtle" strokeWidth="1" />
          <text x="120" y="30" textAnchor="middle" className="fill-text-secondary" fontSize="10">NL Query</text>
          {/* Arrow */}
          <line x1="120" y1="42" x2="120" y2="58" className="stroke-text-tertiary" strokeWidth="1" />
          {/* Intent Layer */}
          <rect x="40" y="58" width="160" height="44" rx="6" className="fill-blue-500/10 stroke-blue-400/40" strokeWidth="1" />
          <text x="120" y="76" textAnchor="middle" className="fill-blue-400" fontSize="10" fontWeight="600">LLM Router</text>
          <text x="120" y="90" textAnchor="middle" className="fill-text-tertiary" fontSize="8">Intent only — no data</text>
          {/* Boundary */}
          <line x1="20" y1="115" x2="220" y2="115" className="stroke-red-400/60" strokeWidth="1" strokeDasharray="4 3" />
          <text x="120" y="128" textAnchor="middle" className="fill-red-400/70" fontSize="7">DATA BOUNDARY</text>
          {/* Computation Layer */}
          <rect x="40" y="136" width="160" height="100" rx="6" className="fill-green-500/10 stroke-green-400/40" strokeWidth="1" />
          <text x="120" y="154" textAnchor="middle" className="fill-green-400" fontSize="10" fontWeight="600">Deterministic Agents</text>
          {/* Three agents */}
          <rect x="52" y="164" width="44" height="24" rx="4" className="fill-surface stroke-border-subtle" strokeWidth="0.5" />
          <text x="74" y="179" textAnchor="middle" className="fill-text-tertiary" fontSize="7">EPM</text>
          <rect x="98" y="164" width="44" height="24" rx="4" className="fill-surface stroke-border-subtle" strokeWidth="0.5" />
          <text x="120" y="179" textAnchor="middle" className="fill-text-tertiary" fontSize="7">HC</text>
          <rect x="144" y="164" width="44" height="24" rx="4" className="fill-surface stroke-border-subtle" strokeWidth="0.5" />
          <text x="166" y="179" textAnchor="middle" className="fill-text-tertiary" fontSize="7">OP</text>
          <text x="120" y="224" textAnchor="middle" className="fill-text-tertiary" fontSize="8">Data stays here</text>
          {/* Output */}
          <line x1="120" y1="236" x2="120" y2="250" className="stroke-text-tertiary" strokeWidth="1" />
          <rect x="60" y="250" width="120" height="32" rx="6" className="fill-surface stroke-border-subtle" strokeWidth="1" />
          <text x="120" y="270" textAnchor="middle" className="fill-text-secondary" fontSize="10">Response</text>
          {/* Success marks */}
          <text x="208" y="76" className="fill-green-400" fontSize="14">✓</text>
          <text x="208" y="90" className="fill-green-400" fontSize="8">Semantic</text>
          <text x="208" y="166" className="fill-green-400" fontSize="14">✓</text>
          <text x="208" y="180" className="fill-green-400" fontSize="8">Deterministic</text>
          <text x="208" y="200" className="fill-green-400" fontSize="14">✓</text>
          <text x="208" y="214" className="fill-green-400" fontSize="8">Secure</text>
        </svg>
      </motion.div>
    </div>
  );
}
