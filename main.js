/*  --------------------------------------  */
/*            Global settings               */
/*  --------------------------------------  */

var DEBUG = true;  // Enable to see logs
var IMPORTFOLDER = "music" // Change music to folder you would like to import from.


let playlistPrompt = new Dialog({
    title: "Import from music directory?",
    content: "<p>Select either to import or cancel</p>",
    buttons: {
     one: {
      icon: '<i class="fas fa-check"></i>',
      label: "Begin Import",
      callback: () => beginPlaylistImport(IMPORTFOLDER)
     },
     two: {
      icon: '<i class="fas fa-times"></i>',
      label: "Cancel",
      callback: () => console.log("Playlist-Importer: Canceled")
     }
    },
    default: "two",
    close: () => console.log("Playlist-Importer: Prompt Closed")
   });



/*  --------------------------------------  */
/*           Helper functions               */
/*  --------------------------------------  */


/**
 * Grabs the most recent folder name. Used in playlist naming.
 * @private
 * @param {string} path 
 */

function _getBaseName(path){
    return path.split('/').reverse()[0];
}

/**
 * Formats the filenames of songs to something more readable. You can add additional REGEX for other audio extensions.
 * @private
 * @param {string} name 
 */

function _convertToUserFriendly(name){
     name = name.replace(/(%20)+/g, '-').toLowerCase();
     name = name.split(/(.mp3|.mp4|.wav)+/g)[0];
     if(DEBUG)
        console.log(`Playlist-Importer: Converting playlist name to eliminate spaces and extension: ${name}.`);
     return name;
}

/**
 * Waits for the creation of a playlist in a seperate function for readability.
 * @param {string} playlistName 
 */

async function generatePlaylist(playlistName){
    await Playlist.create(  {
        "name": playlistName,
        "permission": {
          "default": 0
        },
        "flags": {},
        "sounds": [],
        "mode": 0,
        "playing": false
      });
      if(DEBUG)
        console.log(`Playlist-Importer: Successfully created playlist: ${playlistName}`);
}


/*  --------------------------------------  */
/*           Creation functions             */
/*  --------------------------------------  */

/**
 * Given a path and a playlist name, it will search the path for all files and attempt to add them the created playlist using playlistName.
 * @param {string} path 
 * @param {string} playlistName 
 */

async function getItemsFromDir(path, playlistName){
    await generatePlaylist(playlistName);
    let playlist = game.playlists.entities.find(p => p.name === playlistName);
    game.socket.emit("getFiles", path, {}, async function(resp){
        let localFiles = resp.files;
        for(var i = 0, len = localFiles.length; i < len; i++){
            let trackName = await _convertToUserFriendly(_getBaseName(localFiles[i]));
            if(DEBUG)
                console.log(`Playlist-Importer: Adding audio track: ${trackName}`);
            
            await playlist.createSound({name: trackName, path: localFiles[i], loop: true, volume: 0.5}, true);      
        }
    });
}

/**
 * Called by the dialogue to begin the importation process. This is the function that starts the process.
 * @param {string} path 
 */
function beginPlaylistImport(path){
    game.socket.emit("getFiles", path, {}, resp => {
        let localDirs = resp.dirs;
        for(var i = 0, len = localDirs.length; i< len; i++){
            if(DEBUG)
                console.log(localDirs[i]);  
            getItemsFromDir(localDirs[i], _getBaseName(localDirs[i]));
        }
    });
}


/*  --------------------------------------  */
/*                 Hooks                    */
/*  --------------------------------------  */

/**
 * Appends a button onto the playlist to import songs.
 */

Hooks.on('renderPlaylistDirectory', (app, html, data) => {
    if(DEBUG)
        console.log("Playlist-Importer: Rendering playlist option");  
    
    const importButton = $('<button  style="min-width: 96%; margin: 10px 6px;">Playlist Import</button>');
    
    html.find('.directory-footer').append(importButton);
    importButton.click(ev => {
        playlistPrompt.render(true);
    });
});