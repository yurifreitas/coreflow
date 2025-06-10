// src/components/types.ts

export type Tool = {
  name: string;
  args?: Record<string, any>;
};

export type AgentData = {
  label: string;
  model?: string;
  description?: string;
  tools?: Tool[];
};

export type RouterData = {
  label: string;
  description?: string;
};

export type SupervisorData = {
  state: string;
  decisionLogic?: string;
  scope?: 'global' | 'subgraph';
};


export type CustomNodeData = AgentData | RouterData | SupervisorData;

import type { Node } from '@xyflow/react';
export type CustomNode = Node<CustomNodeData>;
