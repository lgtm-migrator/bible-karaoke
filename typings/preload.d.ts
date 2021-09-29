import { api } from '../src/main/preload';

declare global {
  // eslint-disable-next-line
  interface Window {
    // eslint-disable-next-line no-undef
    ipc: typeof api;
  }
}
