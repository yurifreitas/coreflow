// ✅ useFlow.ts
import { createContext, useContext } from 'react';
import type { FlowNode, FlowEdge } from './types';

export type FlowContextType = {
  nodes: FlowNode[];
  setNodes: React.Dispatch<React.SetStateAction<FlowNode[]>>;
  edges: FlowEdge[];
  setEdges: React.Dispatch<React.SetStateAction<FlowEdge[]>>;
  draggingFrom: string | null;
  setDraggingFrom: React.Dispatch<React.SetStateAction<string | null>>;
  tempTargetPos: { x: number; y: number } | null;
  setTempTargetPos: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
};

export const FlowContext = createContext<FlowContextType | null>(null);

export const useFlow = () => {
  const ctx = useContext(FlowContext);
  if (!ctx) throw new Error('useFlow must be used inside a FlowProvider');
  return ctx;
};
