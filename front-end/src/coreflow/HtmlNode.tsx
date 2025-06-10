import { useEffect, useMemo, useRef, useState, useLayoutEffect } from 'react';
import type { FlowNode } from './types';
import { useDragNode } from './useDragNode';
import { useFlow } from './useFlow';
import { NodeHandles } from './NodeHandles';
import { NodeContent } from './NodeContent';
import { groupRefs } from './handleRefs';

type Props = {
  node: FlowNode;
  scale: number;
};

export default function HtmlNode({ node, scale }: Props) {
  const { handleMouseDown, nodeRef } = useDragNode(node, scale);
  const { nodes } = useFlow();

  const isGroup = node.type === 'group';
  const defaultWidth = node.style?.width ?? 160;
  const defaultHeight = node.style?.height ?? 60;

  const [dynamicHeight, setDynamicHeight] = useState<number>(defaultHeight);
  const contentRef = useRef<HTMLDivElement>(null);

  const parent = useMemo(() => {
    return node.parentId ? nodes.find(n => n.id === node.parentId) : undefined;
  }, [nodes, node.parentId]);

  const inheritedBorderColor =
    parent?.style?.borderColor || parent?.style?.border?.toString().split(' ').pop() || '#555';

  const [currentVisualGroup, setCurrentVisualGroup] = useState<string | undefined>(undefined);

  useEffect(() => {
    const el = document.getElementById(`node-${node.id}`);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (const [groupId, ref] of Object.entries(groupRefs)) {
      if (!ref) continue;
      const groupRect = ref.getBoundingClientRect();
      const inside =
        centerX >= groupRect.left &&
        centerX <= groupRect.right &&
        centerY >= groupRect.top &&
        centerY <= groupRect.bottom;

      if (inside) {
        setCurrentVisualGroup(groupId);
        return;
      }
    }

    setCurrentVisualGroup(undefined);
  }, [node.position.x, node.position.y, nodes.length]);

  const borderColor = useMemo(() => {
    if (isGroup) return '#888';
    if (!currentVisualGroup && !node.parentId) return '#555';
    if (currentVisualGroup === node.parentId) return inheritedBorderColor;
    return '#e74c3c';
  }, [isGroup, currentVisualGroup, node.parentId, inheritedBorderColor]);

  useLayoutEffect(() => {
    if (contentRef.current) {
      const measured = contentRef.current.getBoundingClientRect().height;
      setDynamicHeight(measured + 30); // padding interno + margem extra
    }
  }, [node.data?.inputs]);

  return (
    <div
      ref={(el) => {
        nodeRef.current = el;
        if (isGroup) groupRefs[node.id] = el;
      }}
      id={`node-${node.id}`}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: node.position.x,
        top: node.position.y,
        width: defaultWidth,
        height: dynamicHeight,
        background: isGroup ? '#eaeaea' : '#fff',
        border: `2px solid ${borderColor}`,
        borderRadius: 8,
        padding: 8,
        fontSize: 14,
        userSelect: 'none',
        cursor: 'grab',
        zIndex: isGroup ? 1 : 100,
        ...node.style,
      }}
    >
      <NodeHandles node={node} />
      <div ref={contentRef}>
        <NodeContent node={node} />
      </div>
    </div>
  );
}
