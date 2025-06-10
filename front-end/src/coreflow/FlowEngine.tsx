import { useState, useEffect, useRef } from 'react';
import CanvasEdges from './CanvasEdges';
import HtmlNode from './HtmlNode';
import { useFlow } from './useFlow';
import { sampleNodes, sampleEdges } from './sampleWorkflow';

export default function FlowEngine() {
  const { nodes, setNodes, edges, setEdges } = useFlow();
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNodes(sampleNodes);
    setEdges(sampleEdges);
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = 1.1;
    setScale((prev) => (e.deltaY < 0 ? prev * factor : prev / factor));
  };

  const handlePanStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const initialOffset = { ...offset };

    const handleMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      setOffset({ x: initialOffset.x + dx, y: initialOffset.y + dy });
    };

    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  return (
    <div
      ref={containerRef}
      onWheelCapture={handleWheel}
      onMouseDown={handlePanStart}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        backgroundImage: 'linear-gradient(to right, #ddd 1px, transparent 1px), linear-gradient(to bottom, #ddd 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        cursor: 'grab',
      }}
    >
      <CanvasEdges nodes={nodes} edges={edges} scale={scale} offset={offset} />
     <div
  id="flow-transform-wrapper" // <- adicionado aqui
  style={{
    transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
    transformOrigin: 'top left',
    position: 'absolute',
    top: 0,
    left: 0,
  }}
>
      
        {nodes.map((node) => (
          <HtmlNode key={node.id} node={node} scale={scale} />
        ))}
      </div>
    </div>
  );
}
