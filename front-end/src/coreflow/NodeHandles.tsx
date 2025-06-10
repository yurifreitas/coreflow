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

  // Define os handles por tipo de nó
  const isAgent = node.type === 'agent';
  const handles = isAgent
    ? ['input', 'output', 'prompt']
    : ['input', 'output'];

  // Estilos dinâmicos alinhados verticalmente no centro
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
          onPointerDown={handlePointerDown(handleType)}
          style={getHandleStyle(handleType)}
        />
      ))}
    </>
  );
}
