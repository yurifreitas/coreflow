import { useConnections } from './useConnections';
import type { FlowNode } from './types';
import { useRef, useEffect } from 'react';
import { useFlow } from './useFlow';

type Props = {
  node: FlowNode;
  scale: number;
  offset: { x: number; y: number };
};

const handleColors: Record<string, string> = {
  input: '#3498db',
  output: '#e67e22',
  prompt: '#9b59b6',
  resposta: '#1abc9c',
};

export function NodeHandles({ node, scale, offset }: Props) {
  const {
    setTemporaryEdge,
    clearTemporaryEdge,
    createEdge,
  } = useConnections();

  const { handlePositions, setHandlePositions } = useFlow();
  const handleRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const updateHandlePosition = (type: string) => {
    const el = handleRefs.current[type];
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const pos = {
      x: (rect.left + rect.width / 2),
      y: (rect.top + rect.height / 2),
    };

    setHandlePositions((prev) => ({
      ...prev,
      [node.id]: {
        ...(prev[node.id] || {}),
        [type]: pos,
      },
    }));
  };

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      Object.keys(handleRefs.current).forEach(updateHandlePosition);
    });

    Object.values(handleRefs.current).forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handlePointerDown = (handleType: string) => (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const from = node.id;
    const fromSide = handleType;
    const startPos = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    const move = (ev: PointerEvent) => {
      setTemporaryEdge({
        from,
        fromSide,
        toPos: { x: ev.clientX, y: ev.clientY },
      });
    };

    const up = (ev: PointerEvent) => {
      const target = document.elementFromPoint(ev.clientX, ev.clientY) as HTMLElement | null;
      const toHandle = target?.closest('[data-node-id][data-handle]');
      const to = toHandle?.getAttribute('data-node-id');
      const toSide = toHandle?.getAttribute('data-handle');

      if (to && toSide && (to !== from || toSide !== fromSide)) {
        createEdge(from, fromSide as any, to, toSide as any);
      }

      clearTemporaryEdge();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const handles = ['input', 'output', 'prompt', 'resposta'].filter((t) =>
    node.type === 'agent' ? true : ['input', 'output'].includes(t)
  );

  const getHandleStyle = (handleType: string): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      width: 14,
      height: 14,
      borderRadius: '50%',
      backgroundColor: handleColors[handleType] || '#888',
      cursor: 'pointer',
      zIndex: 10,
      top: '50%',
      transform: 'translateY(-50%)',
    };

    if (handleType === 'input' || handleType === 'prompt') {
      base.left = -10;
    } else if (handleType === 'output' || handleType === 'resposta') {
      base.right = -10;
    }

    return base;
  };

  return (
    <>
      {handles.map((handleType) => (
        <div
          key={handleType}
          data-node-id={node.id}
          data-handle={handleType}
          ref={(el) => (handleRefs.current[handleType] = el)}
          onPointerDown={handlePointerDown(handleType)}
          style={getHandleStyle(handleType)}
        />
      ))}
    </>
  );
}
