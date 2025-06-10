// CanvasEdges.tsx
import React from 'react';
import type { FlowNode, FlowEdge } from './types';
import { useConnections } from './useConnections';

type Props = {
  nodes: FlowNode[];
  edges: FlowEdge[];
  scale: number;
  offset: { x: number; y: number };
};

export default function CanvasEdges({ nodes, edges, scale, offset }: Props) {
  const { dragging } = useConnections();

  // 🔧 Alinhamento real com base no handle DOM
  const getHandleCenter = (nodeId: string, side: string) => {
    const el = document.querySelector(
      `[data-node-id="${nodeId}"][data-handle="${side}"]`
    ) as HTMLElement | null;

    if (!el) return { x: 0, y: 0 };

    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  // Geração de curva (bezier)
  const genPath = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const dx = Math.max(Math.abs(b.x - a.x) * 0.5, 40);
    return `M ${a.x},${a.y} C ${a.x + dx},${a.y} ${b.x - dx},${b.y} ${b.x},${b.y}`;
  };

  return (
    <svg
      width="100%"
      height="100%"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
        </marker>
      </defs>

      {/* Edges reais */}
      {edges.map((edge) => {
        const from = getHandleCenter(edge.source, edge.sourceHandle || 'output');
        const to = getHandleCenter(edge.target, edge.targetHandle || 'input');
        return (
          <path
            key={edge.id}
            d={genPath(from, to)}
            stroke="#333"
            strokeWidth={2}
            fill="none"
            markerEnd="url(#arrowhead)"
          />
        );
      })}

      {/* Linha temporária durante drag */}
      {dragging && (
        <path
          d={genPath(
            getHandleCenter(dragging.from, dragging.fromSide),
            dragging.toPos
          )}
          stroke="gray"
          strokeWidth={2}
          strokeDasharray="4"
          fill="none"
        />
      )}
    </svg>
  );
}
