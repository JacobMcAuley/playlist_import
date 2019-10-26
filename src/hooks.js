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