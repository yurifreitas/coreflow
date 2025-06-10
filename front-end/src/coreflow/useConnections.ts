// useConnections.ts
import { useCallback } from 'react';
import { useFlow } from './useFlow';
import type { FlowEdge } from './types';

export function useConnections() {
  const {
    edges,
    setEdges,
    draggingFrom,
    setDraggingFrom,
    tempTargetPos,
    setTempTargetPos,
  } = useFlow();

  // Ativa a linha temporária
  const setTemporaryEdge = useCallback(
    (params: {
      from: string;
      fromSide: 'input' | 'output';
      toPos: { x: number; y: number };
    }) => {
      setDraggingFrom(`${params.from}:${params.fromSide}`);
      setTempTargetPos(params.toPos);
    },
    [setDraggingFrom, setTempTargetPos]
  );

  // Desativa a linha temporária
  const clearTemporaryEdge = useCallback(() => {
    setDraggingFrom(null);
    setTempTargetPos(null);
  }, [setDraggingFrom, setTempTargetPos]);

  // Cria uma aresta final entre dois nós
  const createEdge = useCallback(
    (from: string, fromSide: 'input' | 'output', to: string, toSide: 'input' | 'output') => {
      const source = fromSide === 'output' ? from : to;
      const target = fromSide === 'output' ? to : from;
      const id = `${source}-${target}`;

      const newEdge: FlowEdge = { id, source, target };
      setEdges((prev) => [...prev.filter((e) => e.id !== id), newEdge]);
      clearTemporaryEdge();
    },
    [setEdges, clearTemporaryEdge]
  );

  // Reconstrói `dragging` com base nos dois estados
  const dragging = draggingFrom && tempTargetPos
    ? {
        from: draggingFrom.split(':')[0],
        fromSide: draggingFrom.split(':')[1] as 'input' | 'output',
        toPos: tempTargetPos,
      }
    : null;

  return {
    edges,
    createEdge,
    setTemporaryEdge,
    clearTemporaryEdge,
    dragging,
  };
}
