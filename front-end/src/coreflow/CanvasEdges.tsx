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

  const getHandlePos = (id: string, side: 'input' | 'output') => {
    const node = nodes.find(n => n.id === id);
    if (!node) return { x: 0, y: 0 };

    const width = node.style?.width ?? 160;
    const height = node.style?.height ?? 60;

    const x = node.position.x + (side === 'output' ? width : 0);
    const y = node.position.y + height / 2;

    return {
      x: x * scale + offset.x,
      y: y * scale + offset.y,
    };
  };

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
        const from = getHandlePos(edge.source, 'output');
        const to = getHandlePos(edge.target, 'input');
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

      {/* Linha temporária */}
      {dragging && (
        <path
          d={genPath(
            getHandlePos(dragging.from, dragging.fromSide),
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
