import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { AgentData } from '../types';

const AgentNode = ({ data }: NodeProps<AgentData>) => {
  return (
    <div
      style={{
        border: '1px solid #888',
        borderRadius: 8,
        padding: 10,
        background: '#fff',
        position: 'relative',
        minWidth: 180,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: 'red',
          width: 12,
          height: 12,
          borderRadius: '50%',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: 'green',
          width: 12,
          height: 12,
          borderRadius: '50%',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
        }}
      />
      <strong>{data.label}</strong>
      {data.tools && data.tools.length > 0 && (
        <div style={{ fontSize: '0.75em', marginTop: 6 }}>
          <strong>Tools:</strong>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {data.tools.map((tool, index) => (
              <li key={index}>{tool}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default memo(AgentNode);
