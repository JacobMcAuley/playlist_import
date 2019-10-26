/*  --------------------------------------  */
/*            Global settings               */
/*  --------------------------------------  */

var DEBUG = true;  // Enable to see logs
var IMPORTFOLDER = "music" // Change music to folder you would like to import from.

/*  --------------------------------------  */
/*                 Prompts                  */
/*  --------------------------------------  */
class PlaylistImporter{
    constructor(){}
    /*  --------------------------------------  */
    /*           Helper functions               */
    /*  --------------------------------------  */


    /**
     * Grabs the most recent folder name. Used in playlist naming.
     * @private
     * @param {string} filePath 
     */

    _getBaseName(filePath){
        return filePath.split('/').reverse()[0];
    }

    /**
     * Validates the audio extension to be of type mp3, mp4, wav, ogg.
     * @private
     * @param {string} fileName 
     */

    _validateFileType(fileName){
        let ext = fileName.split('.').pop();
        if(DEBUG)
            console.log(`Playlist-Importer: Extension is determined to be (${ext}).`)

        if(ext.match(/(mp3|mp4|wav|ogg)+/g))
            return true;
        return false;
    }

    /**
     * Formats the filenames of songs to something more readable. You can add additional REGEX for other audio extensions.
     * @private
     * @param {string} name 
     */

    _convertToUserFriendly(name){
        name = name.replace(/(%20)+/g, ' ').toLowerCase();
        name = name.split(/(.mp3|.mp4|.wav|.ogg)+/g)[0];
        if(DEBUG)
        console.log(`Playlist-Importer: Converting playlist name to eliminate spaces and extension: ${name}.`);
        return name;
    }


    /**
     * Waits for the creation of a playlist in a seperate function for readability.
     * @param {string} playlistName 
     */

    _generatePlaylist(playlistName){
        return new Promise(async (resolve, reject) => {
            const test = await game.playlists.entities.find(p => p.name === playlistName);

            console.log(test);

            if(test == null){
                try{
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
                        resolve(true);
                }
                catch(error){
                    reject(false);
                }
            
            }
            resolve(false);
        })
    }

    /**
     * Given a path and a playlist name, it will search the path for all files and attempt to add them the created playlist using playlistName.
     * @param {string} path 
     * @param {string} playlistName 
     */

    _getItemsFromDir(path, playlistName){
        let playlist = game.playlists.entities.find(p => p.name === playlistName);
        return new Promise(async (resolve, reject) => {
            game.socket.emit("getFiles", path, {}, async function(resp){

                let localFiles = resp.files;

                for(const fileName of localFiles){
                    const valid = await _validateFileType(fileName);
                    if(valid){
                        let trackName = _convertToUserFriendly(_getBaseName(fileName));
                        await playlist.createSound({name: trackName, path: fileName, loop: true, volume: 0.5}, true);
                   
playlistPrompt = new Dialog({
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
    default: "Cancel",
    close: () => console.log("Playlist-Importer: Prompt Closed")
}); }
                    else{
                        if(DEBUG)
                            console.log(`Playlist-Importer: Determined ${fileName} to be of an invalid ext. If you believe this to be an error contact me on Discord.`)
                    }
                } 
                resolve(true);
            });
        });
    }

    /**
     * A helper function designed to prompt the player of task completion.
     */
    _playlistCompletePrompt(){
        let playlistComplete = new Dialog({
            title: "Operation Completed",
            content: "<p>Playlist-Importer has completed its task.</p>",
            buttons: {
            one: {
            icon: '<i class="fas fa-check"></i>',
            label: "Close",
            callback: () => console.log("Close")
            }
            },
            default: "Ack",
            close: () => console.log("Playlist-Importer: Prompt Closed")
        });
        playlistComplete.render(true);
    }

/*  --------------------------------------  */
/*                 Interface                */
/*  --------------------------------------  */

    playlistDirectoryInterface(){
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
            default: "Cancel",
            close: () => console.log("Playlist-Importer: Prompt Closed")
        });
        playlistPrompt.render(true);
    }


    /**
     * Called by the dialogue to begin the importation process. This is the function that starts the process.
     * @param {string} path 
     */
    async beginPlaylistImport(path){
        game.socket.emit("getFiles", path, {}, async resp => {
            let localDirs = resp.dirs;
            
            for(const dirName of localDirs){
                let success = await _generatePlaylist(_getBaseName(dirName));
                if(DEBUG)
                    console.log(`TT: ${dirName}: ${success} on creating playlists`);
            }

            for(const dirName of localDirs){
                await _getItemsFromDir(dirName, _getBaseName(dirName));   
            }

            if(DEBUG)
                console.log("Playlist-Importer: Operation Completed. Thank you!");
            playlistCompletePrompt();
        });
    }
}