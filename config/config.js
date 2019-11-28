PLAYLIST_IMPORTER_CONFIG = {
    module : "playlist_import",
    key : "enableDuplicateChecking",
    settings : {
        name : "Song Duplicate Checker",
        hint: "Checks during the importation process to see if duplicate songs exist, excluding them if true.",
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
        choices: undefined
    }    
}