import { useMemo } from 'react';
import { NetworkNode, NetworkConnection } from '@/shared/types';

/**
 * Custom hook to manage Network Illustration data and animation state.
 * Centralizes node coordinates and connection indices for the Hero SVGs.
 */

const NODES: NetworkNode[] = [
  { cx: 60, cy: 80, delay: '0s' },
  { cx: 180, cy: 40, delay: '0.3s' },
  { cx: 320, cy: 100, delay: '0.6s' },
  { cx: 380, cy: 200, delay: '0.9s' },
  { cx: 300, cy: 300, delay: '1.2s' },
  { cx: 160, cy: 320, delay: '1.5s' },
  { cx: 40, cy: 240, delay: '1.8s' },
  { cx: 200, cy: 180, delay: '2.1s', highlight: true },
  { cx: 280, cy: 160, delay: '2.4s', highlight: true },
  { cx: 100, cy: 160, delay: '2.7s', highlight: true },
];

const CONNECTIONS: NetworkConnection[] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0],
  [7, 1], [7, 8], [7, 5], [8, 2], [8, 3], [9, 0], [9, 7], [9, 6]
];

export const useNetworkAnimation = () => {
  const nodes = useMemo(() => NODES, []);
  const connections = useMemo(() => CONNECTIONS, []);
  return { nodes, connections };
};
