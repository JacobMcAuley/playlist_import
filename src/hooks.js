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
Hooks.on('canvasInit', () =>{
    game.settings.register('playlist_import', 'songs', {
        scope: 'world',
        default : {},
        type: Object
    });  
});

/**
 * Sets up module settings.
 */
Hooks.on('init', () => {
    game.settings.register(PLAYLIST_IMPORTER_CONFIG.module, PLAYLIST_IMPORTER_CONFIG.key, PLAYLIST_IMPORTER_CONFIG.settings);
});