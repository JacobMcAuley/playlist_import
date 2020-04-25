/*  --------------------------------------  */
/*                 Hooks                    */
/*  --------------------------------------  */

/**
 * Appends a button onto the playlist to import songs.
 */
const GLOBAL_PLAYLIST_IMPORTER = new PlaylistImporter();

Hooks.on('renderPlaylistDirectory', (app, html, data) => {
    const importButton = $('<button  style="min-width: 96%; margin: 10px 6px;">Playlist Import</button>');
    html.find('.directory-footer').append(importButton);
    importButton.click(ev => {
        GLOBAL_PLAYLIST_IMPORTER.playlistDirectoryInterface();
    });
});

/**
 * Appends a button onto the settings to clear playlist "Hashtable" memory.
 */

Hooks.on('renderSettings', (app, html) => {
    const importButton = $('<button>Playlist-Importer Memory Clear</button>');
    html.find("button[data-action='setup']").after(importButton);
    importButton.click(ev => {
        GLOBAL_PLAYLIST_IMPORTER.clearMemoryInterface();
    });
});

/**
 * Initializes songs "Hashtable" if not already
 */
Hooks.on('ready', () =>{
    game.settings.register('playlist_import', 'songs', {
        scope: 'world',
        default : {},
        type: Object
    });  

    game.settings.register('playlist_import', 'folderDir', {
        name: "Base music directory",
        hint: "Select a directory to serve as the base directory for music import",
        type: window.Azzu.SettingsTypes.DirectoryPicker,
        default: "music",
        scope: "world",
        config: true
    })

    let sources = new FilePicker().sources;
    let options = Object.keys(sources)
    game.settings.register('playlist_import', 'source', {
        name: "Select source: ",
        hint: `Options include [${options}]`,
        type: String,
        default : "data",
        scope: 'world',
        config: true
    });  

    game.settings.register('playlist_import', 'bucket', {
        name: "S3 Bucket:",
        hint: "If using an s3 bucket, enter in the name of the bucket here.",
        type: String,
        default : "",
        scope: 'world',
        config: true
    });  

});

/**
 * Sets up module settings.
 */
Hooks.on('init', () => {
    game.settings.register(PLAYLIST_IMPORTER_CONFIG.module, PLAYLIST_IMPORTER_CONFIG.key, PLAYLIST_IMPORTER_CONFIG.settings);
});