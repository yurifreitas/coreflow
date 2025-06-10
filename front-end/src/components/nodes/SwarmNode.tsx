import { Handle, Position } from '@xyflow/react';

const SwarmNode = ({ data }) => (
  <div style={{ background: '#7c3aed', color: 'white', padding: 12, borderRadius: 8 }}>
    <Handle type="target" position={Position.Top} />
    <div><strong>🧠 Enxame</strong></div>
    <ul style={{ fontSize: 10, paddingLeft: 10 }}>
      {data.agents.map((a, i) => <li key={i}>• {a}</li>)}
    </ul>
    <Handle type="source" position={Position.Bottom} />
  </div>
);

export default SwarmNode;
