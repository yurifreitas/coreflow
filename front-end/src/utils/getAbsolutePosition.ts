// utils/getAbsolutePosition.ts
import { FlowNode } from '../coreflow/types';

export function getAbsolutePosition(
  node: FlowNode,
  allNodes: FlowNode[]
): { x: number; y: number } {
  let x = node.position.x;
  let y = node.position.y;
  let current = node;

  while (current.parentId) {
    const parent = allNodes.find((n) => n.id === current.parentId);
    if (!parent) break;
    x += parent.position.x;
    y += parent.position.y;
    current = parent;
  }

  return { x, y };
}
