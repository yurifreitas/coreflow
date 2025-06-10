import { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type OnNodeDrag,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { initialNodes } from './data/initialNodes';
import { initialEdges } from './data/initialEdges';
import { nodeTypes } from './config/nodeTypes';

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  style: { stroke: '#999' },
  labelStyle: { fill: '#333', fontSize: 12 },
};

const onNodeDrag: OnNodeDrag = (_, node) => {
  console.log('🔄 Node arrastado:', node);
};

export default function Flow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const rfProps = useMemo(
    () => ({
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      onConnect,
      onNodeDrag,
      fitView: true,
      defaultEdgeOptions,
      nodeTypes,
    }),
    [nodes, edges]
  );

  return (
    <div id="flow-wrapper" className="w-full h-screen">
      <ReactFlow {...rfProps}>
        <Background variant="dots" gap={12} size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
