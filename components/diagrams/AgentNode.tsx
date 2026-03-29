'use client';

import { memo, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface AgentNodeData {
  label: string;
  description: string;
  icon: string;
  category: 'user' | 'orchestrator' | 'tool' | 'rag' | 'output' | 'input' | 'process' | 'data';
  accentColor?: string;
}

const CATEGORY_STYLES: Record<string, { border: string; bg: string; glow: string }> = {
  user: { border: 'border-emerald-500/60', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/20' },
  orchestrator: { border: 'border-accent/60', bg: 'bg-accent/10', glow: 'shadow-accent/20' },
  tool: { border: 'border-amber-500/60', bg: 'bg-amber-500/10', glow: 'shadow-amber-500/20' },
  rag: { border: 'border-purple-500/60', bg: 'bg-purple-500/10', glow: 'shadow-purple-500/20' },
  output: { border: 'border-cyan-500/60', bg: 'bg-cyan-500/10', glow: 'shadow-cyan-500/20' },
  input: { border: 'border-emerald-500/60', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/20' },
  process: { border: 'border-blue-500/60', bg: 'bg-blue-500/10', glow: 'shadow-blue-500/20' },
  data: { border: 'border-amber-500/60', bg: 'bg-amber-500/10', glow: 'shadow-amber-500/20' },
};

function AgentNode({ data }: NodeProps) {
  const [hovered, setHovered] = useState(false);
  const nodeData = data as unknown as AgentNodeData;
  const style = CATEGORY_STYLES[nodeData.category] || CATEGORY_STYLES.process;

  // If a custom accent color is provided, use inline styles instead
  const useCustomColor = !!nodeData.accentColor;

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
          'rounded-xl border px-5 py-4 backdrop-blur-sm transition-shadow duration-300 min-w-[140px] max-w-[200px]',
          !useCustomColor && style.border,
          !useCustomColor && style.bg,
          !useCustomColor && hovered && `shadow-lg ${style.glow}`
        )}
        style={useCustomColor ? {
          borderColor: `${nodeData.accentColor}60`,
          backgroundColor: `${nodeData.accentColor}15`,
          boxShadow: hovered ? `0 10px 15px -3px ${nodeData.accentColor}20` : undefined,
        } : undefined}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{nodeData.icon}</span>
          <span className="text-xs font-semibold text-text-primary">{nodeData.label}</span>
        </div>

        <AnimatePresence>
          {hovered && nodeData.description && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 text-[10px] leading-relaxed text-text-secondary"
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
