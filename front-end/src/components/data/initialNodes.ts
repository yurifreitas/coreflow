import type { Node } from '@xyflow/react';

export const initialNodes: Node[] = [
  {
    id: 'supervisor_global',
    type: 'group',
    data: { label: 'Supervisor Global' },
    position: { x: 0, y: 0 },
    style: {
      width: 1600,
      height: 300,
      border: '2px solid #333',
      background: '#f0f0f0',
    },
  },

  {
    id: 'agent_usuario',
    type: 'agent',
    data: { label: 'Consulta Usuário', tools: ['verificar_usuario'] },
    position: { x: 40, y: 40 },
    parentId: 'supervisor_global',
    extent: 'parent',
  },
  {
    id: 'agent_dados',
    type: 'agent',
    data: { label: 'Consulta Dados', tools: ['obter_dados'] },
    position: { x: 240, y: 40 },
    parentId: 'supervisor_global',
    extent: 'parent',
  },
  {
    id: 'agent_redis',
    type: 'agent',
    data: { label: 'Consulta Redis', tools: ['redis.get'] },
    position: { x: 440, y: 40 },
    parentId: 'supervisor_global',
    extent: 'parent',
  },
  {
    id: 'agent_vector',
    type: 'agent',
    data: { label: 'Consulta Vetor', tools: ['vector.search'] },
    position: { x: 640, y: 40 },
    parentId: 'supervisor_global',
    extent: 'parent',
  },
  {
    id: 'agent_analysis',
    type: 'agent',
    data: { label: 'Análise Semântica', tools: ['analise_semantica'] },
    position: { x: 840, y: 40 },
    parentId: 'supervisor_global',
    extent: 'parent',
  },
  {
    id: 'agent_summary',
    type: 'agent',
    data: { label: 'Resumo Final', tools: ['resumir'] },
    position: { x: 1040, y: 40 },
    parentId: 'supervisor_global',
    extent: 'parent',
  },
  {
    id: 'agent_resposta',
    type: 'agent',
    data: { label: 'Formata Resposta', tools: ['formatar_resposta'] },
    position: { x: 1240, y: 40 },
    parentId: 'supervisor_global',
    extent: 'parent',
  },
];
