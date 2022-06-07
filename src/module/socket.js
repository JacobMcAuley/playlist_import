import CONSTANTS from './constants.js';
import { debug } from './lib/lib.js';
import { setSocket } from '../main.js';
export const SOCKET_HANDLERS = {
  /**
   * Generic sockets
   */
  CALL_HOOK: 'callHook',
};
export let playlistImportSocket;
export function registerSocket() {
  debug('Registered playlistImportSocket');
  if (playlistImportSocket) {
    return playlistImportSocket;
  }
  //@ts-ignore
  // eslint-disable-next-line no-undef
  playlistImportSocket = socketlib.registerModule(CONSTANTS.MODULE_NAME);
  /**
   * Generic socket
   */
  playlistImportSocket.register(SOCKET_HANDLERS.CALL_HOOK, (hook, ...args) => callHook(hook, ...args));

  // Basic
  setSocket(playlistImportSocket);
  return playlistImportSocket;
}
async function callHook(inHookName, ...args) {
  const newArgs = [];
  for (let arg of args) {
    if (typeof arg === 'string') {
      const testArg = await fromUuid(arg);
      if (testArg) {
        arg = testArg;
      }
    }
    newArgs.push(arg);
  }
  return Hooks.callAll(inHookName, ...newArgs);
}
