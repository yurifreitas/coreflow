export type FlowNode = {
  id: string;
  label: string;
  position: { x: number; y: number };

  // Tipos de node
  type?: 'default' | 'group' | 'agent' | 'input' | 'output' | 'prompt' | 'model';

  // Estilo visual
  style?: React.CSSProperties;

  // Dados adicionais (para agentes, funções, tool handlers, etc)
  data?: {
    inputs?: NodeInput[];
    // Você pode adicionar `promptConfig` ou `promptMeta` se quiser algo específico
  };

  // Agrupamento (hierarquia visual)
  parentId?: string;
  extent?: 'parent' | 'full'; // 'full' se quiser expandir além do pai

  // Flags úteis
  draggable?: boolean;
  selectable?: boolean;
  hidden?: boolean;
};
export type NodeInput = {
  name: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'textarea';
  placeholder?: string;
  options?: string[];
};
export type FlowEdge = {
  id: string;
  source: string; // ID do node de origem
  target: string; // ID do node de destino

  // Conexões com ports (opcional)
  sourceHandle?: string;
  targetHandle?: string;

  // Estilo e metadata
  label?: string;
  style?: React.CSSProperties;
  animated?: boolean;
  markerEnd?: string;
};
