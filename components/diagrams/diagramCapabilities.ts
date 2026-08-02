/**
 * Shared interaction contract for the project architecture diagrams.
 *
 * ReactFlow's visual graph is supplementary: SemanticDiagramFallback is the
 * authoritative server-rendered description for assistive technology.
 */
export const PROJECT_DIAGRAM_REACT_FLOW_PROPS = {
  nodesDraggable: false,
  nodesConnectable: false,
  nodesFocusable: false,
  edgesFocusable: false,
  elementsSelectable: false,
  deleteKeyCode: null,
  panOnDrag: true,
  panOnScroll: false,
  zoomOnScroll: false,
  zoomOnPinch: true,
  zoomOnDoubleClick: true,
  preventScrolling: false,
  disableKeyboardA11y: true,
  onNodeClick: () => undefined,
  'aria-hidden': true,
} as const;
