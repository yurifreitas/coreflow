import { useRef } from 'react';
import type { FlowNode } from './types';
import { useFlow } from './useFlow';
import { groupRefs } from './handleRefs';

export function useDragNode(node: FlowNode, scale: number) {
  const { nodes, setNodes } = useFlow();
  const nodeRef = useRef<HTMLDivElement>(null);
  const isGroup = node.type === 'group';

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // 🛑 Ignora qualquer clique nos handles do NodeHandles
    if (
      target?.closest('[data-handle="output"]') ||
      target?.closest('[data-handle="input"]')
    ) {
      return;
    }

    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;

    const affectedIds = isGroup
      ? nodes.filter(n => n.id === node.id || n.parentId === node.id).map(n => n.id)
      : [node.id];

    const startPositions = new Map(
      nodes
        .filter(n => affectedIds.includes(n.id))
        .map(n => [n.id, { x: n.position.x, y: n.position.y }])
    );

    let hasMoved = false;

    const onMouseMove = (ev: MouseEvent) => {
      hasMoved = true;
      const dx = (ev.clientX - startX) / scale;
      const dy = (ev.clientY - startY) / scale;

      setNodes(prev =>
        prev.map(n => {
          if (!startPositions.has(n.id)) return n;
          const start = startPositions.get(n.id)!;
          return {
            ...n,
            position: {
              x: start.x + dx,
              y: start.y + dy,
            },
          };
        })
      );
    };

    const onMouseUp = (ev: MouseEvent) => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      const upTarget = ev.target as HTMLElement;
      if (
        upTarget?.closest('[data-handle="output"]') ||
        upTarget?.closest('[data-handle="input"]')
      ) {
        return;
      }

      if (!isGroup && hasMoved) {
        const el = document.getElementById(`node-${node.id}`);
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const nodeCenterX = rect.left + rect.width / 2;
        const nodeCenterY = rect.top + rect.height / 2;

        let newParentId: string | undefined;
        for (const [id, ref] of Object.entries(groupRefs)) {
          if (!ref) continue;
          const groupRect = ref.getBoundingClientRect();
          const inside =
            nodeCenterX >= groupRect.left &&
            nodeCenterX <= groupRect.right &&
            nodeCenterY >= groupRect.top &&
            nodeCenterY <= groupRect.bottom;
          if (inside) {
            newParentId = id;
            break;
          }
        }

        setNodes(prev =>
          prev.map(n =>
            n.id === node.id
              ? {
                  ...n,
                  parentId: newParentId,
                  extent: newParentId ? 'parent' : undefined,
                }
              : n
          )
        );
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return { nodeRef, handleMouseDown };
}
