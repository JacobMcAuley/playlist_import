import CONSTANTS from "./constants";

export const registerSettings = function () {

  game.settings.register(CONSTANTS.MODULE_NAME, 'songs', {
    name: `${CONSTANTS.LANG}.Songs`,
    hint: `${CONSTANTS.LANG}.SongsHint`,
    scope: 'world',
    config: false,
    default: {},
    type: Object,
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'bucket', {
    name: `${CONSTANTS.LANG}.BucketSelect`,
    hint: `${CONSTANTS.LANG}.BucketSelectHint`,
    scope: 'world',
    config: true,
    default: '',
    type: String,
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'shouldRepeat', {
    name: `${CONSTANTS.LANG}.ShouldRepeat`,
    hint: `${CONSTANTS.LANG}.ShouldRepeatHint`,
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'shouldStream', {
    name: `${CONSTANTS.LANG}.ShouldStream`,
    hint: `${CONSTANTS.LANG}.ShouldStreamHint`,
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'folderDir', {
    name: `${CONSTANTS.LANG}.FolderDir`,
    hint: `${CONSTANTS.LANG}.FolderDirHint`,
    scope: 'world',
    config: true,
    default: 'music',
    type: String,
    filePicker: true,
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'logVolume', {
    name: `${CONSTANTS.LANG}.LogVolume`,
    hint: `${CONSTANTS.LANG}.LogVolumeHint`,
    scope: 'world',
    config: true,
    default: '0.5',
    type: String,
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'enableDuplicateChecking', {
    name: `${CONSTANTS.LANG}.EnableDuplicate`,
    hint: `${CONSTANTS.LANG}.EnableDuplicateHint`,
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'customRegexDelete', {
    name: `${CONSTANTS.LANG}.CustomRegexDelete`,
    hint: `${CONSTANTS.LANG}.CustomRegexDeleteHint`,
    scope: 'world',
    config: true,
    default: '^\\d\\d+ *_*-* *',
    type: String,
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'shouldOverridePlaylist', {
    name: `${CONSTANTS.LANG}.ShouldOverridePlaylist`,
    hint: `${CONSTANTS.LANG}.ShouldOverridePlaylistHint`,
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });
  let sources = new FilePicker().sources;
  let options = Object.keys(sources);
  game.settings.register(CONSTANTS.MODULE_NAME, 'source', {
    name: game.i18n.localize(`${CONSTANTS.LANG}.SelectSource`),
    hint: `${game.i18n.localize(`${CONSTANTS.LANG}.SelectSourceHint`)} [${options}]`,
    scope: 'world',
    config: true,
    default: 'data',
    type: String,
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'shouldDeletePlaylist', {
    name: `${CONSTANTS.LANG}.ShouldDeletePlaylist`,
    hint: `${CONSTANTS.LANG}.ShouldDeletePlaylistHint`,
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'maintainOriginalFolderName', {
    name: `${CONSTANTS.LANG}.MaintainOriginalFolderName`,
    hint: `${CONSTANTS.LANG}.MaintainOriginalFolderNameHint`,
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });
}
