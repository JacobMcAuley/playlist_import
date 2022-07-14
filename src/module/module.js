import { registerSocket } from './socket.js';
import { setApi } from '../main.js';
import { PlaylistImporterInitializer } from './PlaylistImporterInitializer.js';
export const initHooks = () => {
  // registerSettings();
  // registerLibwrappers();
  // new HandlebarHelpers().registerHelpers();
  Hooks.once('socketlib.ready', registerSocket);
};
export const setupHooks = () => {
  //@ts-ignore
  setApi(window.ConditionalVisibility.API);
};
export const readyHooks = () => {
  // checkSystem();
  // registerHotkeys();
  // Hooks.callAll(HOOKS.READY);
  PlaylistImporterInitializer.hookReady();
  PlaylistImporterInitializer.hookRenderPlaylistDirectory();
  PlaylistImporterInitializer.hookRenderSettings();
  PlaylistImporterInitializer.hookDeletePlaylist();
  PlaylistImporterInitializer.hookDeletePlaylistSound();
};
