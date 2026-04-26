'use client';

import dynamic from 'next/dynamic';

const Spinner = () => (
  <div className="flex h-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
  </div>
);

// Post 1: Agentic AI
export const AgenticArchitecture = dynamic(() => import('./diagrams/AgenticArchitecture'), { ssr: false, loading: Spinner });
export const SubAgentExecution = dynamic(() => import('./diagrams/SubAgentExecution'), { ssr: false, loading: Spinner });
export const PermissionCascade = dynamic(() => import('./diagrams/PermissionCascade'), { ssr: false, loading: Spinner });
/** @deprecated alias — see PermissionCascade. */
export const EPMTranslation = PermissionCascade;
export const FullSystemArchitecture = dynamic(() => import('./diagrams/FullSystemArchitecture'), { ssr: false, loading: Spinner });
export const EventModelAnimation = dynamic(() => import('./diagrams/EventModelAnimation'), { ssr: false, loading: Spinner });

// Post 2: Text-to-SQL / Aegis
export const FiveStagePipeline = dynamic(() => import('./diagrams/FiveStagePipeline'), { ssr: false, loading: Spinner });
export const EmbeddingSpace = dynamic(() => import('./diagrams/EmbeddingSpace'), { ssr: false, loading: Spinner });
export const GuardrailValidator = dynamic(() => import('./diagrams/GuardrailValidator'), { ssr: false, loading: Spinner });
export const FullPipelineFlow = dynamic(() => import('./diagrams/FullPipelineFlow'), { ssr: false, loading: Spinner });
export const AegisCascade = dynamic(() => import('./diagrams/AegisCascade'), { ssr: false, loading: Spinner });

// Post 3: Closed-Loop / PSO
export const ClosedLoopCycle = dynamic(() => import('./diagrams/ClosedLoopCycle'), { ssr: false, loading: Spinner });
export const ModelSelectionScatter = dynamic(() => import('./diagrams/ModelSelectionScatter'), { ssr: false, loading: Spinner });
export const PSOSwarm = dynamic(() => import('./diagrams/PSOSwarm'), { ssr: false, loading: Spinner });
export const AbstractionLadder = dynamic(() => import('./diagrams/AbstractionLadder'), { ssr: false, loading: Spinner });

// Post 4: Enterprise Agentic AI
export const AgenticArchitecturePAR = dynamic(() => import('./diagrams/AgenticArchitecturePAR'), { ssr: false, loading: Spinner });
