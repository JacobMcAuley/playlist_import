/*  --------------------------------------  */
/*                 Hooks                    */
/*  --------------------------------------  */

/**
 * Appends a button onto the playlist to import songs.
 */

Hooks.on('renderPlaylistDirectory', (app, html, data) => {
    let playlistImporter = new PlaylistImporter();
    const importButton = $('<button  style="min-width: 96%; margin: 10px 6px;">Playlist Import</button>');
    
    html.find('.directory-footer').append(importButton);
    importButton.click(ev => {
        playlistImporter.playlistDirectoryInterface();
    });
});


Hooks.on('canvasInit', () =>{
    game.settings.register('playlist_import', 'songs', {
        scope: 'world',
        default : {},
        type: Object
    });
    currentList = game.settings.get('playlist_import', 'songs');
    //game.settings.set('playlist_import', 'songs', {});   
});

Hooks.on('init', () => {
    game.settings.register(PLAYLIST_IMPORTER_CONFIG.module, PLAYLIST_IMPORTER_CONFIG.key, PLAYLIST_IMPORTER_CONFIG.settings);
});