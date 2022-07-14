import CONSTANTS from './constants.js';
import { debug, warn } from './lib/lib.js';
import { PlaylistImporter } from './PlaylistImporter.js';

export let PIMPL;
export class PlaylistImporterInitializer {
  constructor() {}

  // static initialize() {
  //   PlaylistImporterInitializer.hookReady();
  //   PlaylistImporterInitializer.hookRenderPlaylistDirectory();
  //   PlaylistImporterInitializer.hookRenderSettings();
  //   PlaylistImporterInitializer.hookDeletePlaylist();
  //   PlaylistImporterInitializer.hookDeletePlaylistSound();
  // }

  static hookRenderPlaylistDirectory() {
    /**
     * Appends a button onto the playlist to import songs.
     */

    Hooks.on('renderPlaylistDirectory', (app, html, data) => {
      html.find('.directory-footer')[0].style.display = 'inherit';
      const importPlaylistString = game.i18n.localize(`${CONSTANTS.LANG}.ImportButton`);
      const importButton = $(`<button  style="width: 50%;">${importPlaylistString}</button>`);
      if (game.user?.isGM || game.user?.can('SETTINGS_MODIFY')) {
        html.find('.directory-footer').append(importButton);
        importButton.on('click', (ev) => {
          PIMPL.playlistImporter.playlistDirectoryInterface();
        });
      }
      const deleteAllPlaylistString = game.i18n.localize(`${CONSTANTS.LANG}.DeleteAllButton`);
      const deleteAllButton = $(`<button  style="width: 50%;">${deleteAllPlaylistString}</button>`);
      if (game.user?.isGM || game.user?.can('SETTINGS_MODIFY')) {
        html.find('.directory-footer').append(deleteAllButton);
        deleteAllButton.on('click', async (ev) => {
          const playlists = game.playlists?.contents;
          for (const playlist of playlists) {
            const playlistHasFlag = playlist.getFlag(CONSTANTS.MODULE_NAME, 'isPlaylistImported');
            if (playlistHasFlag && playlistHasFlag == true) {
              await playlist.delete();
            }
          }
        });
      }
    });
  }

  static _removeSound(playlistName, soundNames) {
    const currentList = game.settings.get(CONSTANTS.MODULE_NAME, 'songs');
    soundNames.forEach((soundName) => {
      const trackName = PlaylistImporter._convertToUserFriendly(PlaylistImporter._getBaseName(soundName));
      const mergedName = (playlistName + trackName).toLowerCase();
      if (trackName && playlistName) {
        if (currentList[mergedName]) {
          delete currentList[mergedName];
        }
      }
    });
    game.settings.set(CONSTANTS.MODULE_NAME, 'songs', currentList);
  }

  static hookDeletePlaylist() {
    Hooks.on('deletePlaylist', (playlist, flags, id) => {
      const playlistName = playlist.name;
      const soundObjects = playlist.sounds;
      const sounds = [];
      for (let i = 0; i < soundObjects.length; ++i) {
        sounds.push(soundObjects[i].path);
      }

      PlaylistImporterInitializer._removeSound(playlistName, sounds);
    });
  }

  static hookDeletePlaylistSound() {
    Hooks.on('deletePlaylistSound', (playlist, data, flags, id) => {
      const playlistName = playlist.data.name;
      const soundName = data.path;
      PlaylistImporterInitializer._removeSound(playlistName, [soundName]);
    });
  }

  static hookRenderSettings() {
    /**
     * Appends a button onto the settings to clear playlist "Hashtable" memory.
     */
    Hooks.on('renderSettings', (app, html) => {
      const clearMemoryString = game.i18n.localize(`${CONSTANTS.LANG}.ClearMemory`);
      const importButton = $(`<button>${clearMemoryString}</button>`);
      // For posterity.
      if (game.user?.isGM || game.user?.can('SETTINGS_MODIFY')) {
        html.find("button[data-action='players']").after(importButton);
        importButton.click((ev) => {
          PIMPL.playlistImporter.clearMemoryInterface();
        });
      }
    });
  }

  static hookReady() {
    Hooks.on('ready', () => {
      PIMPL.playlistImporter = new PlaylistImporter();
      // PlaylistImporterInitializer._registerSettings();
      registerSettings();
    });
  }

  // static _registerSettings() {
  //   PlaylistImporterConfig.registerSettings();
  //   // PlaylistImporterConfig.initializeConfigParams();
  //   // CONSTANTS.PLAYLISTCONFIG.forEach((setting) => {
  //   //   game.settings.register(CONSTANTS.MODULE_NAME, setting.key, setting.settings);
  //   // });
  //   // let sources = new FilePicker().sources;
  //   // let options = Object.keys(sources);
  //   // game.settings.register(CONSTANTS.MODULE_NAME, 'source', {
  //   //   name: game.i18n.localize(`${CONSTANTS.LANG}.SelectSource`),
  //   //   hint: `${game.i18n.localize(`${CONSTANTS.LANG}.SelectSourceHint`)} [${options}]`,
  //   //   type: String,
  //   //   default: 'data',
  //   //   scope: 'world',
  //   //   config: true,
  //   // });
  // }
}

// PlaylistImporterInitializer.initialize();
