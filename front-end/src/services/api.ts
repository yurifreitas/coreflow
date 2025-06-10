// src/services/api.ts

import type { CustomNode } from '../components/types';
import { Edge } from '@xyflow/react';

export function compileToLangGraph(nodes: CustomNode[], edges: Edge[]) {
  return nodes.map((node) => {
    if (node.type === 'agent') {
      return {
        id: node.id,
        type: 'agent',
        model: node.data.model,
        tools: node.data.tools,
        next: edges.filter(e => e.source === node.id).map(e => e.target),
      };
    }

    if (node.type === 'router') {
      return {
        id: node.id,
        type: 'router',
        description: node.data.description,
        branches: edges.filter(e => e.source === node.id).map(e => e.target),
      };
    }

    if (node.type === 'supervisor') {
      return {
        id: node.id,
        type: 'supervisor',
        state: node.data.state,
      };
    }

    return null;
  }).filter(Boolean);
}
