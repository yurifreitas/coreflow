import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

type SupervisorData = {
  state: string;
  decisionLogic?: string;
  scope?: 'global' | 'subgraph';
};

const SupervisorNode = ({ data }: NodeProps<SupervisorData>) => {
  return (
    <div
      style={{
        border: '2px dashed #444',
        borderRadius: 10,
        padding: 12,
        background: '#e8f0ff',
        minWidth: 180,
        textAlign: 'center',
      }}
    >
      <strong>Supervisor</strong>
      <div style={{ fontSize: '0.8em', marginTop: 6 }}>
        Estado: <em>{data.state}</em>
      </div>
      {data.scope && (
        <div style={{ fontSize: '0.7em', marginTop: 4, color: '#666' }}>
          Escopo: {data.scope}
        </div>
      )}
      {data.decisionLogic && (
        <div style={{ fontSize: '0.7em', marginTop: 2, color: '#999' }}>
          Decisão: {data.decisionLogic}
        </div>
      )}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default memo(SupervisorNode);
