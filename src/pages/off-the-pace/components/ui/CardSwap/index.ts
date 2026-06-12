// Barrel file: re-exports CardSwap and Card so callers can import both from the
// folder (`from '.../CardSwap'`) without reaching into the implementation file.
export { default as CardSwap, Card } from './CardSwap';
