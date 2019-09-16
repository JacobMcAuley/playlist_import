var DEBUG = false;


//Pass a path to get the most recent directory
function _getBaseName(path){
    return path.split('/').reverse()[0];
}

function _convertSpacesToDashes(name){
    return name.replace(/\s+/g, '-').toLowerCase();
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
        console.log(`Audio Importer: Successfully created playlist: ${playlistName}`);
}


async function getItemsFromDir(path, playlistName){
    await generatePlaylist(playlistName);
    let playlist = game.playlists.entities.find(p => p.name === playlistName);
    game.socket.emit("getFiles", path, {}, async function(resp){
        let localFiles = resp.files;
        for(var i = 0, len = localFiles.length; i < len; i++){
            let trackName = await _convertSpacesToDashes(_getBaseName(localFiles[i]));
            if(DEBUG)
                console.log(`Audio Importer: Adding audio track: ${trackName}`);
            
            await playlist.createSound({name: trackName, path: localFiles[i], loop: true, volume: 0.5}, true);      
        }
    });
}