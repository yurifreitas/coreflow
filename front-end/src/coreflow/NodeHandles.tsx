import { useConnections } from './useConnections';
import type { FlowNode } from './types';

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

const handlePositions: Record<string, React.CSSProperties> = {
  input: {
    left: -10,
    top: '30%',
    transform: 'translateY(-50%)',
  },
  output: {
    right: -10,
    top: '30%',
    transform: 'translateY(-50%)',
  },
  prompt: {
    left: -10,
    top: '70%',
    transform: 'translateY(-50%)',
  },

};

export function NodeHandles({ node }: Props) {
  const {
    setTemporaryEdge,
    clearTemporaryEdge,
    createEdge,
  } = useConnections();

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
        createEdge(from, fromSide, to, toSide);
      }

      clearTemporaryEdge();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  // Condicional por tipo do nó
  const isAgent = node.type === 'agent';
  const handles = isAgent
    ? ['input', 'output', 'prompt']
    : ['input', 'output'];

  return (
    <>
      {handles.map((handleType) => (
        <div
          key={handleType}
          data-node-id={node.id}
          data-handle={handleType}
          onPointerDown={handlePointerDown(handleType)}
          style={{
            position: 'absolute',
            width: 14,
            height: 14,
            borderRadius: '50%',
            backgroundColor: handleColors[handleType] || '#888',
            cursor: 'pointer',
            zIndex: 10,
            ...handlePositions[handleType],
          }}
        />
      ))}
    </>
  );
}
