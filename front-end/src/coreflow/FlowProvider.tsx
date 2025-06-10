// ✅ FlowProvider.tsx
import { useState } from 'react';
import { FlowContext } from './useFlow';
import type { FlowNode, FlowEdge } from './types';

export function FlowProvider({ children }: { children: React.ReactNode }) {
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<FlowEdge[]>([]);
  const [draggingFrom, setDraggingFrom] = useState<string | null>(null);
  const [tempTargetPos, setTempTargetPos] = useState<{ x: number; y: number } | null>(null);

  const value = {
    nodes,
    setNodes,
    edges,
    setEdges,
    draggingFrom,
    setDraggingFrom,
    tempTargetPos,
    setTempTargetPos,
  };

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}
