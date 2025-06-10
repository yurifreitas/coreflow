import { useFlow } from './useFlow';
import { FlowNode } from './types';
import { nanoid } from 'nanoid';

const nodeTypes = ['input', 'select', 'agent', 'text', 'code', 'output'];

export default function NodeToolbar() {
  const { setNodes } = useFlow();

  const handleAddNode = (type: string) => {
    const newNode: FlowNode = {
      id: `node-${nanoid()}`,
      type,
      label: `Novo ${type}`,
      position: { x: Math.random() * 600, y: Math.random() * 400 },
      style: {},
      data: {},
    };
    setNodes(prev => [...prev, newNode]);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 10,
      zIndex: 100,
      display: 'flex',
      gap: 8,
      background: '#fff',
      padding: 8,
      borderRadius: 8,
      boxShadow: '0 0 4px rgba(0,0,0,0.2)',
      flexWrap: 'wrap',
    }}>
      {nodeTypes.map(type => (
        <button key={type} onClick={() => handleAddNode(type)}>
          ➕ {type}
        </button>
      ))}
    </div>
  );
}
