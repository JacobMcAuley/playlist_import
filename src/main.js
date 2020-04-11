/*  --------------------------------------  */
/*                 Prompts                  */
/*  --------------------------------------  */
class PlaylistImporter{
    constructor(){
        /*  --------------------------------------  */
        /*            Global settings               */
        /*  --------------------------------------  */
        this.DEBUG = false;  // Enable to see logs
    }
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
        if(this.DEBUG)
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
        if(this.DEBUG)
        console.log(`Playlist-Importer: Converting playlist name to eliminate spaces and extension: ${name}.`);
        return name;
    }


    /**
     * Waits for the creation of a playlist in a separate function for readability.
     * @param {string} playlistName 
     */

    _generatePlaylist(playlistName){
        return new Promise(async (resolve, reject) => {
            const playlistExists = await game.playlists.entities.find(p => p.name === playlistName);
            if(playlistExists == null){
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
                    if(this.DEBUG)
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

    _getItemsFromDir(source, path, playlistName){
        let dupCheck = game.settings.get('playlist_import', 'enableDuplicateChecking');
        let playlist = game.playlists.entities.find(p => p.name === playlistName);
        return new Promise(async (resolve, reject) => {
            FilePicker.browse(source, path).then(async function(resp){
                let localFiles = resp.files;
                for(const fileName of localFiles){
                    const valid = await this._validateFileType(fileName);
                    if(valid){
                        let trackName = this._convertToUserFriendly(this._getBaseName(fileName));
                        let currentList = await game.settings.get('playlist_import', 'songs');
                        
                        if(dupCheck){
                            if(currentList[trackName] != true){
                                currentList[trackName] = true;
                                if(this.DEBUG)
                                    console.log(`Playlist-importer: Song ${trackName} not in list.`)
                                await game.settings.set('playlist_import', 'songs', currentList);     
                                await playlist.createEmbeddedEntity("PlaylistSound", {name: trackName, path: fileName, repeat: true, lvolume: 0.5}, {});
                            }  
                        }
                        else{   
                            currentList[trackName] = true;
                            await game.settings.set('playlist_import', 'songs', currentList);    
                            await playlist.createEmbeddedEntity("PlaylistSound", {name: trackName, path: fileName, repeat: true, lvolume: 0.5}, {});                            
                        }
                    }
                    else{
                        if(this.DEBUG)
                            console.log(`Playlist-Importer: Determined ${fileName} to be of an invalid ext. If you believe this to be an error contact me on Discord.`)
                    }
                } 
                resolve(true);
            }.bind(this));
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

    /**
     * A helper function designed to clear the stored history of songs
     */
    _clearSongHistory(){
        game.settings.set('playlist_import', 'songs', {}); 
    }

/*  --------------------------------------  */
/*                 Interface                */
/*  --------------------------------------  */

    clearMemoryInterface(){
        let clearMemoryPrompt = new Dialog({
            title: "WARNING: IRREVERSIBLE",
            content: "<p>Would you like to reset the stored songs table? This will make it so Playlist-importer believes that all songs are new.</p>",
            buttons: {
            one: {
            label: "*WARNING: Irreversible* CLEAR TABLE",
            callback: () => this._clearSongHistory()
            },
            two: {
            label: "Cancel",
            callback: () => console.log("Playlist-Importer: Canceled")
            }
            },
            default: "Cancel",
            close: () => console.log("Playlist-Importer: Prompt Closed")
        });
        clearMemoryPrompt.render(true);      
    }


    playlistDirectoryInterface(){
        let playlistPrompt = new Dialog({
            title: "Import from music directory?",
            content: "<p>Select either to import or cancel</p>",
            buttons: {
            one: {
            icon: '<i class="fas fa-check"></i>',
            label: "Begin Import",
            callback: () => this.beginPlaylistImport(game.settings.get("playlist_import", "source"), window.Azzu.SettingsTypes.DirectoryPicker.format(game.settings.get("playlist_import", "folderDir")))
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
    async beginPlaylistImport(source, path){
        FilePicker.browse(source, path).then(async resp => {
            let localDirs = resp.dirs; 
            for(const dirName of localDirs){
                let success = await this._generatePlaylist(this._getBaseName(dirName));
                if(this.DEBUG)
                    console.log(`TT: ${dirName}: ${success} on creating playlists`);
            }

            for(const dirName of localDirs){
                await this._getItemsFromDir(source, dirName, this._getBaseName(dirName));   
            }

            if(this.DEBUG)
                console.log("Playlist-Importer: Operation Completed. Thank you!");
            this._playlistCompletePrompt();
        }) 
    }
}