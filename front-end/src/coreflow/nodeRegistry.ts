// nodeRegistry.ts
import type { FlowNode } from './types';
import { NodeInput } from './types';

export type NodeTypeConfig = {
  label: string;
  inputs: NodeInput[];
};

export const nodeRegistry: Record<string, NodeTypeConfig> = {
  input: {
    label: 'Entrada',
    inputs: [{ name: 'valor', type: 'text', placeholder: 'Digite algo...' }],
  },
  select: {
    label: 'Selecionar',
    inputs: [
      { name: 'opcao', type: 'select', options: ['A', 'B', 'C'] },
    ],
  },
  math: {
    label: 'Expressão Matemática',
    inputs: [
      { name: 'equacao', type: 'text', placeholder: 'ex: 5 * x + 2' },
    ],
  },
  checkbox: {
    label: 'Ativar recurso',
    inputs: [{ name: 'ativo', type: 'checkbox' }],
  },
  code: {
    label: 'Código',
    inputs: [{ name: 'codigo', type: 'textarea', placeholder: '// script' }],
  },
  agent: {
    label: 'Agente',
    inputs: [],
  },
  output: {
    label: 'Saída',
    inputs: [],
  },
};
