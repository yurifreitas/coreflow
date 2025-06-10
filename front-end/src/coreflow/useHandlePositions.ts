// coreflow/useHandlePositions.ts
import { useEffect, useRef, useState } from 'react';

type Pos = { x: number; y: number };
type HandleMap = Record<string, { input?: Pos; output?: Pos }>;

export function useHandlePositions(nodes: { id: string }[]) {
  const [positions, setPositions] = useState<HandleMap>({});
  const rafRef = useRef<number>();
  const observerRef = useRef<ResizeObserver | null>(null);

  const calc = () => {
    const map: HandleMap = {};
    for (const node of nodes) {
      const entry: Partial<Record<'input' | 'output', Pos>> = {};
      ['input', 'output'].forEach((side) => {
        const el = document.querySelector(`[data-node-id="${node.id}"][data-handle="${side}"]`) as HTMLElement | null;
        if (el) {
          const r = el.getBoundingClientRect();
          entry[side as 'input' | 'output'] = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        }
      });
      map[node.id] = entry;
    }
    setPositions(map);
    rafRef.current = requestAnimationFrame(calc);
  };

  useEffect(() => {
    calc(); // inicial
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [nodes]);

  return positions;
}
