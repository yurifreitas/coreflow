import type { FlowNode, FlowEdge } from './types';

export const sampleNodes: FlowNode[] = [
  // === Supervisor Global 1 ===
  {
    id: 'supervisor_global',
    type: 'group',
    label: 'Supervisor Global',
    position: { x: 0, y: 0 },
    style: {
      width: 1600,
      height: 300,
      border: '2px solid #333',
      background: '#f0f0f0',
      zIndex: 0, // garante que grupos fiquem atrás
    },
  },
  {
    id: 'agent_usuario',
    type: 'agent',
    label: 'Consulta Usuário',
    data: { tools: ['verificar_usuario'] },
    position: { x: 40, y: 40 },
    parentId: 'supervisor_global',
    extent: 'parent',
  },
  {
    id: 'agent_dados',
    type: 'agent',
    label: 'Consulta Dados',
    data: { tools: ['obter_dados'] },
    position: { x: 240, y: 40 },
    parentId: 'supervisor_global',
    extent: 'parent',
  },
  {
    id: 'agent_redis',
    type: 'agent',
    label: 'Consulta Redis',
    data: { tools: ['redis.get'] },
    position: { x: 440, y: 40 },
    parentId: 'supervisor_global',
    extent: 'parent',
  },
  {
    id: 'agent_vector',
    type: 'agent',
    label: 'Consulta Vetor',
    data: { tools: ['vector.search'] },
    position: { x: 640, y: 40 },
    parentId: 'supervisor_global',
    extent: 'parent',
  },
  {
    id: 'agent_analysis',
    type: 'agent',
    label: 'Análise Semântica',
    data: { tools: ['analise_semantica'] },
    position: { x: 840, y: 40 },
    parentId: 'supervisor_global',
    extent: 'parent',
  },
  {
    id: 'agent_summary',
    type: 'agent',
    label: 'Resumo Final',
    data: { tools: ['resumir'] },
    position: { x: 1040, y: 40 },
    parentId: 'supervisor_global',
    extent: 'parent',
  },
  {
    id: 'agent_resposta',
    type: 'agent',
    label: 'Formata Resposta',
    data: { tools: ['formatar_resposta'] },
    position: { x: 1240, y: 40 },
    parentId: 'supervisor_global',
    extent: 'parent',
  },

  // === Supervisor Global 2 (posicionado abaixo do outro grupo) ===
  {
    id: 'supervisor_global2',
    type: 'group',
    label: 'Supervisor Global 2',
    position: { x: 0, y: 400 }, // 👈 diferente agora!
    style: {
      width: 1600,
      height: 300,
      border: '2px solid #333',
      background: '#f0f0f0',
      zIndex: 0,
    },
  },
  {
  id: 'prompt_1',
  label: 'Gerador de Prompt',
  position: { x: 150, y: 200 },
  type: 'prompt',
  data: {
    inputs: [
      { name: 'tema', type: 'text', placeholder: 'Digite o tema' },
      { name: 'formato', type: 'select', options: ['texto', 'json', 'resumo'] },
      { name: 'detalhes', type: 'textarea', placeholder: 'Expanda o contexto aqui' },
    ],
  },
}
];


export const sampleEdges: FlowEdge[] = [
  // Supervisor Global
  { id: 'e1', source: 'agent_usuario', target: 'agent_dados' },
  { id: 'e2', source: 'agent_dados', target: 'agent_redis' },
  { id: 'e3', source: 'agent_redis', target: 'agent_vector' },
  { id: 'e4', source: 'agent_vector', target: 'agent_analysis' },
  { id: 'e5', source: 'agent_analysis', target: 'agent_summary' },
  { id: 'e6', source: 'agent_summary', target: 'agent_resposta' },
  { id: 'e7', source: 'supervisor_global', target: 'supervisor_global2' },
];
