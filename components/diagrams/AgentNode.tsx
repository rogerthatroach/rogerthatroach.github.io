'use client';

import { memo, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface AgentNodeData {
  label: string;
  description: string;
  icon: string;
  category: 'user' | 'orchestrator' | 'tool' | 'rag' | 'output';
}

const CATEGORY_STYLES: Record<AgentNodeData['category'], { border: string; bg: string; glow: string }> = {
  user: { border: 'border-emerald-500/60', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/20' },
  orchestrator: { border: 'border-accent/60', bg: 'bg-accent/10', glow: 'shadow-accent/20' },
  tool: { border: 'border-amber-500/60', bg: 'bg-amber-500/10', glow: 'shadow-amber-500/20' },
  rag: { border: 'border-purple-500/60', bg: 'bg-purple-500/10', glow: 'shadow-purple-500/20' },
  output: { border: 'border-cyan-500/60', bg: 'bg-cyan-500/10', glow: 'shadow-cyan-500/20' },
};

function AgentNode({ data }: NodeProps) {
  const [hovered, setHovered] = useState(false);
  const nodeData = data as unknown as AgentNodeData;
  const style = CATEGORY_STYLES[nodeData.category];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative"
    >
      <Handle type="target" position={Position.Top} className="!bg-border-subtle !border-text-tertiary !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-border-subtle !border-text-tertiary !w-2 !h-2" />

      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={cn(
          'rounded-xl border px-5 py-4 backdrop-blur-sm transition-shadow duration-300 min-w-[160px] max-w-[220px]',
          style.border,
          style.bg,
          hovered && `shadow-lg ${style.glow}`
        )}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{nodeData.icon}</span>
          <span className="text-sm font-semibold text-text-primary">{nodeData.label}</span>
        </div>

        <AnimatePresence>
          {hovered && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 text-xs leading-relaxed text-text-secondary"
            >
              {nodeData.description}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default memo(AgentNode);
