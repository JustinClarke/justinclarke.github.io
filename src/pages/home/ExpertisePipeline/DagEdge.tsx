/**
 * DagEdge renders a single cubic-bezier SVG path between two skill nodes.
 *
 * Fits in: the SVG overlay layer inside ExpertisePipeline.
 * Note: coordinates are derived from getBoundingClientRect() at render-time
 *   so they stay accurate after window resizes (the parent triggers re-renders via
 *   a ResizeObserver → tick state increment).
 *
 * For beginners ----------------------------------------------------------------
 * SVG is just markup, so React can build it like any HTML. This component
 * measures where its two cards currently sit on screen, then returns one
 * <path> a curved line between them. Measuring the DOM during render is
 * normally a React no-no (the DOM might not exist yet); it works here because
 * the parent re-renders these edges AFTER layout settles, and bails out (the
 * `return null`) whenever a node hasn't been registered yet.
 * -----------------------------------------------------------------------------
 */
import React from 'react';

interface DagEdgeProps {
  fromName: string;
  toName: string;
  nodeRefs: React.MutableRefObject<Map<string, HTMLDivElement | null>>;
  svgRef: React.RefObject<SVGSVGElement | null>;
  isActive: boolean;
  isHovering: boolean;
  /** CSS rgb() components for the active edge colour, e.g. "0, 200, 180" */
  rgb: string;
}

export const DagEdge: React.FC<DagEdgeProps> = ({
  fromName, toName, nodeRefs, svgRef, isActive, isHovering, rgb,
}) => {
  const fromEl = nodeRefs.current.get(fromName);
  const toEl = nodeRefs.current.get(toName);
  const svgEl = svgRef.current;

  // LEARN: returning null from a component renders nothing the standard way
  //    to say "I can't (or shouldn't) draw yet".
  if (!fromEl || !toEl || !svgEl) return null;

  const fromRect = fromEl.getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();
  const svgRect = svgEl.getBoundingClientRect();

  // Right-center of source → left-center of target
  // LEARN: getBoundingClientRect gives viewport coordinates; subtracting the
  //    SVG's own rect converts them into the SVG's local coordinate space.
  const x1 = fromRect.right - svgRect.left;
  const y1 = fromRect.top + fromRect.height / 2 - svgRect.top;
  const x2 = toRect.left - svgRect.left;
  const y2 = toRect.top + toRect.height / 2 - svgRect.top;

  // Cubic bezier control points produce an elegant S-sweep
  const dx = x2 - x1;
  const cp1x = x1 + dx * 0.45;
  const cp2x = x2 - dx * 0.45;
  const d = `M ${x1},${y1} C ${cp1x},${y1} ${cp2x},${y2} ${x2},${y2}`;

  const isInactive = isHovering && !isActive;

  return (
    <path
      d={d}
      fill="none"
      stroke={isActive ? `rgb(${rgb})` : 'rgba(255,255,255,0.5)'}
      strokeWidth={isActive ? 1.5 : 0.8}
      opacity={isActive ? 1 : isInactive ? 0.025 : 0.07}
      style={{
        filter: isActive ? `drop-shadow(0 0 5px rgba(${rgb}, 0.7))` : 'none',
        // LEARN: the classic SVG line-draw trick: dash the stroke in one
        //    800px-long dash, then slide the dash offset from 800 (line fully
        //    "off the end") to 0 (fully drawn). Animating that offset via the
        //    CSS transition below makes the edge appear to draw itself.
        strokeDasharray: 800,
        strokeDashoffset: isActive ? 0 : 800,
        transition:
          'stroke-dashoffset 0.65s cubic-bezier(0.4, 0, 0.2, 1), ' +
          'opacity 0.3s ease, stroke 0.25s ease, filter 0.25s ease, stroke-width 0.25s ease',
      }}
    />
  );
};
