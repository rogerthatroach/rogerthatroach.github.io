'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Layers } from 'lucide-react';
import AgentNode from '@/components/diagrams/AgentNode';
import AnimatedEdge from '@/components/diagrams/AnimatedEdge';
import NodeDetailPanel from './NodeDetailPanel';
import type { DiagramLevel, LeveledNodeData } from '@/data/playgroundDiagrams';
import { cn } from '@/lib/utils';

const nodeTypes = { agent: AgentNode };
const edgeTypes = { animated: AnimatedEdge };

/**
 * Multi-level diagram with click-to-drill + hover-to-read.
 *
 * State:
 *  - currentLevelId: which level is rendered (drives ReactFlow nodes/edges)
 *  - selectedNode: which leaf node is open in the detail panel (null = closed)
 *  - navigationPath: breadcrumb trail of how we got here (parent levels)
 *
 * Navigation:
 *  - Click a node with `drillTo` → push current level onto path, switch to child
 *  - Click a leaf (no drillTo) with `detail` → open side panel
 *  - Click a breadcrumb → pop back
 *  - Level tabs at top → jump directly
 */
export default function MultiLevelDiagram({ levels }: { levels: DiagramLevel[] }) {
  const [currentId, setCurrentId] = useState(levels[0]?.id ?? 'overview');
  const [path, setPath] = useState<string[]>([]); // breadcrumb trail (excludes current)
  const [selectedNode, setSelectedNode] = useState<LeveledNodeData | null>(null);

  const current = useMemo(
    () => levels.find((l) => l.id === currentId) ?? levels[0],
    [levels, currentId]
  );

  const [nodes, , onNodesChange] = useNodesState(current.nodes);
  const [edges, , onEdgesChange] = useEdgesState(current.edges);

  // Rebuild ReactFlow state when level changes
  useMemo(() => {
    // Trigger via onNodesChange/onEdgesChange for the controlled flow
    // but simplest is to re-render via key change on the container —
    // handled by AnimatePresence below.
  }, [current]);

  const switchToLevel = useCallback(
    (targetId: string, push = false) => {
      if (targetId === currentId) return;
      setSelectedNode(null);
      if (push) {
        setPath((prev) => [...prev, currentId]);
      }
      setCurrentId(targetId);
    },
    [currentId]
  );

  const goBack = useCallback(() => {
    if (path.length === 0) return;
    const parent = path[path.length - 1];
    setPath((prev) => prev.slice(0, -1));
    setSelectedNode(null);
    setCurrentId(parent);
  }, [path]);

  const jumpTo = useCallback(
    (targetId: string, pathIndex?: number) => {
      setSelectedNode(null);
      setCurrentId(targetId);
      if (pathIndex !== undefined) {
        setPath((prev) => prev.slice(0, pathIndex));
      } else {
        setPath([]);
      }
    },
    []
  );

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const data = node.data as unknown as LeveledNodeData;
      if (data.drillTo) {
        switchToLevel(data.drillTo, true);
      } else if (data.detail) {
        setSelectedNode(data);
      }
    },
    [switchToLevel]
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface/30">
      {/* Level tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border-subtle px-4 py-3">
        <Layers size={14} aria-hidden="true" className="text-text-tertiary" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
          Levels
        </span>
        <div className="ml-2 flex flex-wrap gap-1.5">
          {levels.map((lvl) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => jumpTo(lvl.id)}
              aria-pressed={currentId === lvl.id}
              className={cn(
                'rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-all',
                currentId === lvl.id
                  ? 'border-accent bg-accent-muted text-accent'
                  : 'border-border-subtle bg-surface/40 text-text-secondary hover:border-accent/40 hover:text-accent'
              )}
            >
              L{lvl.depth} · {lvl.title}
            </button>
          ))}
        </div>
      </div>

      {/* Breadcrumb trail (shown when user drilled) */}
      {path.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 border-b border-border-subtle px-4 py-2 text-xs text-text-tertiary">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium text-accent transition-colors hover:bg-surface-hover"
            aria-label="Back to previous level"
          >
            ← Back
          </button>
          <span className="mx-1 opacity-50">·</span>
          {path.map((pid, i) => {
            const lvl = levels.find((l) => l.id === pid);
            if (!lvl) return null;
            return (
              <span key={pid} className="inline-flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => jumpTo(pid, i)}
                  className="rounded px-1 transition-colors hover:text-accent"
                >
                  {lvl.title}
                </button>
                <ChevronRight size={10} aria-hidden="true" className="opacity-60" />
              </span>
            );
          })}
          <span className="text-text-primary">{current.title}</span>
        </div>
      )}

      {/* Subtitle / context for the current level */}
      <div className="border-b border-border-subtle px-4 py-2.5">
        <p className="text-xs leading-relaxed text-text-secondary">
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
            L{current.depth} · {current.title}
          </span>
          <span className="mx-2 opacity-40">·</span>
          {current.subtitle}
        </p>
      </div>

      {/* Canvas */}
      <div className="relative h-[560px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="h-full w-full"
          >
            <ReactFlow
              nodes={current.nodes}
              edges={current.edges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodeClick={handleNodeClick}
              fitView
              fitViewOptions={{ padding: 0.15 }}
              proOptions={{ hideAttribution: true }}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={true}
              zoomOnScroll={false}
              panOnScroll={true}
              minZoom={0.5}
              maxZoom={1.5}
            >
              <Background color="var(--color-diagram-grid)" gap={20} size={1} />
              <Controls showInteractive={false} position="bottom-right" />
            </ReactFlow>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {selectedNode && (
            <NodeDetailPanel
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Legend row */}
      <div className="flex flex-wrap items-center gap-4 border-t border-border-subtle px-4 py-3 text-xs text-text-tertiary">
        <span className="font-mono text-[10px] uppercase tracking-widest">How to read</span>
        <span className="inline-flex items-center gap-1.5">
          <ChevronDown size={12} aria-hidden="true" className="text-accent" />
          Hover a node — reveals description
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ChevronDown size={12} aria-hidden="true" className="text-accent" />
          Click a glowing node — drills or opens detail
        </span>
      </div>
    </div>
  );
}
