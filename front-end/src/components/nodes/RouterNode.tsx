import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { RouterNodeType } from '../types';

export default function RouterNode({ data }: NodeProps<RouterNodeType>) {
  return (
    <div style={{ padding: 12, border: '2px dashed #2196f3', borderRadius: 6 }}>
      <Handle type="target" position={Position.Left} />
      <div style={{ fontWeight: 'bold' }}>{data.label}</div>
      {data.description && <div style={{ fontSize: 10 }}>{data.description}</div>}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
