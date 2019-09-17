var DEBUG = true;

let playlistPrompt = new Dialog({
    title: "Import from music directory?",
    content: "<p>Select either to import or cancel</p>",
    buttons: {
     one: {
      icon: '<i class="fas fa-check"></i>',
      label: "Begin Import",
      callback: () => beginPlaylistImport("music")
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

//Pass a path to get the most recent directory
function _getBaseName(path){
    return path.split('/').reverse()[0];
}

function _convertToUserFriendly(name){
     name = name.replace(/(%20)+/g, '-').toLowerCase();
     name = name.split(/(.mp3|.mp4|.wav)+/g)[0];
     if(DEBUG)
        console.log(`Playlist-Importer: Converting playlist name to eliminate spaces and extension: ${name}.`);
     return name;
}


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


Hooks.on('renderPlaylistDirectory', (app, html, data) => {
    if(DEBUG)
        console.log("Playlist-Importer: Rendering playlist option");  
    
    const importButton = $('<button  style="min-width: 96%; margin: 10px 6px;">Playlist Import</button>');
    
    html.find('.directory-footer').append(importButton);
    importButton.click(ev => {
        playlistPrompt.render(true);
    });
});