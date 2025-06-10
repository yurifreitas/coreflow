// src/coreflow/utils/getNodeBorderColor.ts
import type { FlowNode } from '../types';
import { groupRefs } from '../handleRefs';

export function getNodeBorderColor(node: FlowNode, nodes: FlowNode[]): string {
  if (node.type === 'group') return '#888';

  const parent = node.parentId ? nodes.find(n => n.id === node.parentId) : undefined;
  const el = document.getElementById(`node-${node.id}`);
  if (!el) return '#555';

  const rect = el.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  let currentGroupId: string | undefined = undefined;

  for (const [groupId, ref] of Object.entries(groupRefs)) {
    if (!ref) continue;
    const groupRect = ref.getBoundingClientRect();
    const inside =
      centerX >= groupRect.left &&
      centerX <= groupRect.right &&
      centerY >= groupRect.top &&
      centerY <= groupRect.bottom;

    if (inside) {
      currentGroupId = groupId;
      break;
    }
  }

  // Caso sem grupo visível
  if (!currentGroupId && !node.parentId) return '#555';

  // Caso dentro do grupo correto
  if (currentGroupId && currentGroupId === node.parentId) {
    const inheritedColor =
      parent?.style?.borderColor || (parent?.style?.border?.toString().split(' ').pop() ?? '#555');
    return inheritedColor;
  }

  // Caso dentro de outro grupo ou fora de todos
  return '#e74c3c';
}
