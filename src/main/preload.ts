import { contextBridge, ipcRenderer } from 'electron';

export const api = {
  /**
   * Here you can expose functions to the renderer process
   * so they can interact with the main (electron) side
   * without security problems.
   *
   * The function below can accessed using `window.ipc.sendMessage`
   */

  sendMessage: (message: string): void => {
    ipcRenderer.send('message', message);
  },

  /**
   * Provide an easier way to listen to events
   */
  on: (channel: string, callback: Function): void => {
    ipcRenderer.on(channel, (_, ...args) => callback(...args));
  },

  send: (channel: string, ...args: any[]): void => {
    ipcRenderer.send(channel, ...args);
  },
};

contextBridge.exposeInMainWorld('ipc', api);
