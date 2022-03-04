const PLIMP = this.PLIMP || {};
PLIMP.MODULENAME = 'playlist_import';
PLIMP.LANG = 'PLI';
class PlaylistImporterConfig {
  constructor() {}

  static registerSettings() {
    game.settings.register(PLIMP.MODULENAME, 'songs', {
      name: `${PLIMP.LANG}.Songs`,
      hint: `${PLIMP.LANG}.SongsHint`,
      scope: 'world',
      config: false,
      default: {},
      type: Object,
    });
    game.settings.register(PLIMP.MODULENAME, 'bucket', {
      name: `${PLIMP.LANG}.BucketSelect`,
      hint: `${PLIMP.LANG}.BucketSelectHint`,
      scope: 'world',
      config: true,
      default: '',
      type: String,
    });
    game.settings.register(PLIMP.MODULENAME, 'shouldRepeat', {
      name: `${PLIMP.LANG}.ShouldRepeat`,
      hint: `${PLIMP.LANG}.ShouldRepeatHint`,
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });
    game.settings.register(PLIMP.MODULENAME, 'shouldStream', {
      name: `${PLIMP.LANG}.ShouldStream`,
      hint: `${PLIMP.LANG}.ShouldStreamHint`,
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });
    game.settings.register(PLIMP.MODULENAME, 'folderDir', {
      name: `${PLIMP.LANG}.FolderDir`,
      hint: `${PLIMP.LANG}.FolderDirHint`,
      scope: 'world',
      config: true,
      default: 'music',
      type: String,
      filePicker: true,
    });
    game.settings.register(PLIMP.MODULENAME, 'logVolume', {
      name: `${PLIMP.LANG}.LogVolume`,
      hint: `${PLIMP.LANG}.LogVolumeHint`,
      scope: 'world',
      config: true,
      default: '0.5',
      type: String,
    });
    game.settings.register(PLIMP.MODULENAME, 'enableDuplicateChecking', {
      name: `${PLIMP.LANG}.EnableDuplicate`,
      hint: `${PLIMP.LANG}.EnableDuplicateHint`,
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    });
    game.settings.register(PLIMP.MODULENAME, 'customRegexDelete', {
      name: `${PLIMP.LANG}.CustomRegexDelete`,
      hint: `${PLIMP.LANG}.CustomRegexDeleteHint`,
      scope: 'world',
      config: true,
      default: '^\\d\\d+ *_*-* *',
      type: String,
    });
    game.settings.register(PLIMP.MODULENAME, 'shouldOverridePlaylist', {
      name: `${PLIMP.LANG}.ShouldOverridePlaylist`,
      hint: `${PLIMP.LANG}.ShouldOverridePlaylistHint`,
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });
    let sources = new FilePicker().sources;
    let options = Object.keys(sources);
    game.settings.register(PLIMP.MODULENAME, 'source', {
      name: game.i18n.localize(`${PLIMP.LANG}.SelectSource`),
      hint: `${game.i18n.localize(`${PLIMP.LANG}.SelectSourceHint`)} [${options}]`,
      scope: 'world',
      config: true,
      default: 'data',
      type: String,
    });
    game.settings.register(PLIMP.MODULENAME, 'shouldDeletePlaylist', {
      name: `${PLIMP.LANG}.ShouldDeletePlaylist`,
      hint: `${PLIMP.LANG}.ShouldDeletePlaylistHint`,
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });
    game.settings.register(PLIMP.MODULENAME, 'maintainOriginalFolderName', {
      name: `${PLIMP.LANG}.MaintainOriginalFolderName`,
      hint: `${PLIMP.LANG}.MaintainOriginalFolderNameHint`,
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });
  }
}
