import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  c: string;
}

interface Edge {
  from: number;
  to: number;
}

interface NeuralNetCanvasProps {
  className?: string;
  nodeCount?: number;
  isDark?: boolean;
}

const BRAND_COLORS = [
  '#00c8b4', // --color-brand-primary
  '#6366f1', // --color-acc-cloud
  '#a855f7', // --color-acc-bi
  '#ec4899', // --color-acc-creative
  '#38BDF8',
  '#00FFD1'
];

/**
 * NeuralNetCanvas
 * 
 * Optimized canvas animation with:
 * - document.hidden pause
 * - ResizeObserver cleanup
 * - Pre-computed node connections (optimized O(n^2))
 */
export const NeuralNetCanvas: React.FC<NeuralNetCanvasProps> = ({ 
  className, 
  nodeCount = 40, 
  isDark = true 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isVisible = true;

    const initNodes = () => {
      const { width, height } = canvas;
      nodesRef.current = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        c: BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)],
      }));

      // Pre-compute edges based on initial proximity
      const edges: Edge[] = [];
      const nodes = nodesRef.current;
      const MAX_DIST_SQ = 150 * 150;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          if (dx * dx + dy * dy < MAX_DIST_SQ) {
            edges.push({ from: i, to: j });
          }
        }
      }
      edgesRef.current = edges;
    };

    const handleResize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width;
      canvas.height = rect.height;
      initNodes();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    // Intersection Observer to pause when out of view
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.1 });
    intersectionObserver.observe(canvas);

    handleResize();

    const draw = () => {
      if (document.hidden || !isVisible) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const nodes = nodesRef.current;
      const edges = edgesRef.current;

      const haloAlpha = isDark ? 0.15 : 0.1;
      const coreAlpha = isDark ? 0.7 : 0.5;
      const edgeAlphaBase = isDark ? 0.5 : 0.3;

      // Update and draw nodes
      nodes.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Node Glow (Halo)
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = haloAlpha;
        ctx.fill();

        // Node Core (Sharp)
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = coreAlpha;
        ctx.fill();
      });

      // Draw pre-computed edges
      ctx.lineWidth = 0.8;
      
      edges.forEach(edge => {
        const p1 = nodes[edge.from];
        const p2 = nodes[edge.to];
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distSq = dx * dx + dy * dy;
        const maxDistSq = 180 * 180;

        if (distSq < maxDistSq) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          
          ctx.strokeStyle = p1.c;
          ctx.globalAlpha = (1 - Math.sqrt(distSq) / 180) * edgeAlphaBase;
          ctx.stroke();
        }
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [nodeCount, isDark]);

  return (
    <canvas 
      ref={canvasRef} 
      className={className}
      style={{ display: 'block' }} 
    />
  );
};
