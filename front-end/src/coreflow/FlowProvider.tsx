// coreflow/FlowProvider.tsx
import { useState, useEffect, useRef } from 'react';
import { FlowContext } from './useFlow';
import type { FlowNode, FlowEdge } from './types';

type HandlePositions = Record<string, {
  input?: { x: number; y: number };
  output?: { x: number; y: number };
}>;

export function FlowProvider({ children }: { children: React.ReactNode }) {
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<FlowEdge[]>([]);
  const [draggingFrom, setDraggingFrom] = useState<string | null>(null);
  const [tempTargetPos, setTempTargetPos] = useState<{ x: number; y: number } | null>(null);
  const [handlePositions, setHandlePositions] = useState<HandlePositions>({});
  const rafRef = useRef<number>();

  const updatePositions = () => {
    const map: HandlePositions = {};
    for (const node of nodes) {
      const entry: HandlePositions[string] = {};
      ['input', 'output'].forEach((side) => {
        const el = document.querySelector(`[data-node-id="${node.id}"][data-handle="${side}"]`) as HTMLElement | null;
        if (el) {
          const r = el.getBoundingClientRect();
          entry[side as 'input' | 'output'] = {
            x: r.left + r.width / 2,
            y: r.top + r.height / 2,
          };
        }
      });
      map[node.id] = entry;
    }
    setHandlePositions(map);
    rafRef.current = requestAnimationFrame(updatePositions);
  };

  useEffect(() => {
    rafRef.current = requestAnimationFrame(updatePositions);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [nodes]);

  const value = {
    nodes,
    setNodes,
    edges,
    setEdges,
    draggingFrom,
    setDraggingFrom,
    tempTargetPos,
    setTempTargetPos,
    handlePositions,
  };

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}
