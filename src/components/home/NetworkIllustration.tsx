import React from 'react';
import { useNetworkAnimation } from '@/shared/hooks';
import { NetworkNode } from '@/shared/types';

/**
 * @fileoverview Refactored Network Illustration.
 * Displays a lightweight SVG node-graph with CSS-driven animations.
 * Logic and structure are now decoupled via the useNetworkAnimation hook.
 */
export const NetworkIllustrationRect: React.FC<{ startNode: NetworkNode, endNode: NetworkNode, index?: number }> = ({ startNode, endNode, index = 0 }) => (
  <g>
    <line
      x1={startNode.cx} y1={startNode.cy}
      x2={endNode.cx} y2={endNode.cy}
      stroke="rgba(0,160,145,0.12)"
      strokeWidth="1"
    />
    <line
      x1={startNode.cx} y1={startNode.cy}
      x2={endNode.cx} y2={endNode.cy}
      stroke="rgba(0,200,180,0.5)"
      strokeWidth="1.5"
      className="travel-light"
      style={{ animationDelay: `${index * 0.8}s`, animationDuration: `${3 + (index % 3)}s` }}
    />
  </g>
);

export const NetworkNodeDot: React.FC<{ node: NetworkNode }> = ({ node }) => (
  <circle
    cx={node.cx} cy={node.cy}
    r={node.highlight ? 8 : 5}
    fill={node.highlight ? 'rgba(0,160,145,0.85)' : 'rgba(0,160,145,0.5)'}
    className="hero-node-dot"
    style={{ animationDelay: node.delay }}
  />
);

export const NetworkIllustration = () => {
  const { nodes, connections } = useNetworkAnimation();

  return (
    <svg viewBox="0 0 400 360" className="w-full max-w-[480px] h-auto bg-transparent overflow-visible">
      {connections.map(([start, end], i) => (
        <NetworkIllustrationRect 
          key={i} 
          startNode={nodes[start]} 
          endNode={nodes[end]}
          index={i}
        />
      ))}
      {nodes.map((node, i) => (
        <NetworkNodeDot 
          key={i} 
          node={node} 
        />
      ))}
    </svg>
  );
};
