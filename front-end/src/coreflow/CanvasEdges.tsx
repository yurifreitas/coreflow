import React from 'react';
import { useFlow } from './useFlow';
import type { FlowNode, FlowEdge } from './types';

type Props = {
  nodes: FlowNode[];
  edges: FlowEdge[];
};

export default function CanvasEdges({ nodes, edges }: Props) {
  const { handlePositions, draggingFrom, tempTargetPos } = useFlow();

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
        zIndex: 9999,
      }}
    >
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
        </marker>
      </defs>

      {edges.map((edge) => {
        const from = handlePositions[edge.source]?.[edge.sourceHandle || 'output'];
        const to = handlePositions[edge.target]?.[edge.targetHandle || 'input'];
        if (!from || !to) return null;

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

      {/* Linha temporária durante o arrasto */}
      {draggingFrom && tempTargetPos && (() => {
        const parts = draggingFrom.split(':');
        const fromId = parts[0];
        const handle = parts[1] as 'input' | 'output' | 'prompt' | 'resposta';
        const from = handlePositions[fromId]?.[handle];
        if (!from) return null;

        return (
          <path
            d={genPath(from, tempTargetPos)}
            stroke="gray"
            strokeWidth={2}
            strokeDasharray="4"
            fill="none"
          />
        );
      })()}
    </svg>
  );
}
