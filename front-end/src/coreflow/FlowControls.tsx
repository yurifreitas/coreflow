import { useFlow } from './useFlow';
import type { FlowNode } from './types';

export default function FlowControls() {
  const { nodes, edges, setNodes } = useFlow();

  const handleRun = () => {
    console.log('▶️ Run flow', { nodes, edges });
    // lógica de execução
  };

  const handleReset = () => {
    setNodes(prev =>
      prev.map(n => ({
        ...n,
        position: { x: 0, y: 0 },
      }))
    );
  };

  const handleExport = () => {
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flow.json';
    link.click();
  };

  const addNode = (type: string) => {
    const newNode: FlowNode = {
      id: `node-${type}-${Date.now()}`,
      type,
      label: `Novo ${type}`,
      position: {
        x: 100 + Math.random() * 400,
        y: 100 + Math.random() * 300,
      },
      data: {},
    };
    setNodes(prev => [...prev, newNode]);
  };

  const addGroup = () => {
    const newGroup: FlowNode = {
      id: `group-${Date.now()}`,
      type: 'group',
      label: 'Novo Grupo',
      position: {
        x: 200 + Math.random() * 300,
        y: 200 + Math.random() * 300,
      },
      style: {
        width: 400,
        height: 250,
        border: '2px dashed #666',
        background: '#f9f9f9',
      },
    };
    setNodes(prev => [...prev, newGroup]);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 10,
      left: 10,
      zIndex: 100,
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10,
      background: '#fff',
      padding: 10,
      borderRadius: 8,
      boxShadow: '0 0 4px rgba(0,0,0,0.2)',
    }}>
      <button onClick={handleRun}>▶️ Run</button>
      <button onClick={handleReset}>♻️ Reset</button>
      <button onClick={handleExport}>💾 Export</button>
      <button onClick={() => addNode('input')}>➕ Input</button>
      <button onClick={() => addNode('agent')}>➕ Agent</button>
      <button onClick={() => addNode('output')}>➕ Output</button>
      <button onClick={addGroup}>🗂️ Grupo</button>
    </div>
  );
}
