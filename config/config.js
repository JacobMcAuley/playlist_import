const PLIMP = this.PLIMP || {};
PLIMP.MODULENAME = "playlist_import";

class PlaylistImporterConfig {
    constructor(){}

    static initializeConfigParams() {
        PLIMP.PLAYLISTCONFIG = [
            {
                key: "songs",
                settings: {
                    scope: "world",
                    default: {},
                    type: Object,
                }
            },
            {
                key: "bucket",
                settings: {
                    name: game.i18n.localize("PLI.BucketSelect"),
                    hint: game.i18n.localize("PLI.BucketSelectHint"),
                    type: String,
                    default: "",
                    scope: "world",
                    config: true,
                }
            },
            {
                key: "shouldRepeat",
                settings: {
                    name: game.i18n.localize("PLI.ShouldRepeat"),
                    hint: game.i18n.localize("PLI.ShouldRepeatHint"),
                    type: Boolean,
                    default: false,
                    scope: "world",
                    config: true,
                }
            },
            {
                key: "shouldStream",
                settings: {
                    name: game.i18n.localize("PLI.ShouldStream"),
                    hint: game.i18n.localize("PLI.ShouldStreamHint"),
                    type: Boolean,
                    default: false,
                    scope: "world",
                    config: true,
                }
            },
            {
                key: "folderDir",
                settings: {
                    name: game.i18n.localize("PLI.FolderDir"),
                    hint: game.i18n.localize("PLI.FolderDirHint"),
                    type: window.Azzu.SettingsTypes.DirectoryPicker,
                    default: "music",
                    scope: "world",
                    config: true,
                }
            },
            {
                key: "logVolume",
                settings: {
                    name: game.i18n.localize("PLI.LogVolume"),
                    hint: game.i18n.localize("PLI.LogVolumeHint"),
                    type: String,
                    default: "0.5",
                    scope: "world",
                    config: true,
                }
            },
            {
                key: "enableDuplicateChecking",
                settings: {
                    name: game.i18n.localize("PLI.EnableDuplicate"),
                    hint: game.i18n.localize("PLI.EnableDuplicateHint"),
                    scope: "world",
                    config: true,
                    default: true,
                    type: Boolean,
                }
            },
            {
                key: "customRegexDelete",
                settings: {
                    name: game.i18n.localize("PLI.customRegexDelete"),
                    hint: game.i18n.localize("PLI.customRegexDeleteHint"),
                    scope: "world",
                    config: true,
                    default: "^\\d\\d+ *_*-* *",
                    type: String,
                }
            }
        ]
        
    }
}
