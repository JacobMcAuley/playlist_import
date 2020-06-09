const PLIMP = this.PLIMP || {};

class PlaylistImporterInitializer{
    constructor(){}

    static initalize(){
        PlaylistImporterInitializer.hookReady();
        PlaylistImporterInitializer.hookRenderPlaylistDirectory();
        PlaylistImporterInitializer.hookRenderSettings();
    }

    static hookRenderPlaylistDirectory(){
        /**
         * Appends a button onto the playlist to import songs.
         */ 
        Hooks.on('renderPlaylistDirectory', (app, html, data) => {
            const importButton = $('<button  style="min-width: 96%; margin: 10px 6px;">Playlist Import</button>');
            html.find('.directory-footer').append(importButton);
            importButton.click(ev => {
                PLIMP.playlistImporter.playlistDirectoryInterface();
            });
        });
    }

    static hookRenderSettings(){
        /**
         * Appends a button onto the settings to clear playlist "Hashtable" memory.
         */
        Hooks.on('renderSettings', (app, html) => {
            const importButton = $('<button>Playlist-Importer Memory Clear</button>');
            html.find("button[data-action='setup']").after(importButton);
            importButton.click(ev => {
                PLIMP.playlistImporter.clearMemoryInterface();
            });
        });
    }

    static hookReady(){
        Hooks.on('ready', () =>{
            PLIMP.playlistImporter = new PlaylistImporter();

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
        
            game.settings.register('playlist_import', 'shouldRepeat', {
                name: "Set repeat for tracks",
                hint: "Should tracks be set to repeat by default?",
                type: Boolean,
                default : false,
                scope: 'world',
                config: true
            });  
        
            game.settings.register('playlist_import', 'logVolume', {
                name: "Set default volume",
                hint: "On a scale from 0.0 - 1.0",
                type: String,
                default : "0.5",
                scope: 'world',
                config: true
            });  
        
            game.settings.register('playlist_import', 'enableDuplicateChecking', {
                name : "Song Duplicate Checker",
                hint: "Checks during the importation process to see if duplicate songs exist, excluding them if true.",
                scope: "world",
                config: true,
                default: true,
                type: Boolean,
            });  
        });
    }
}

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
     * Validates the audio extension to be of type mp3, mp4, wav, ogg, or flac.
     * @private
     * @param {string} fileName 
     */

    _validateFileType(fileName){
        let ext = fileName.split('.').pop();
        if(this.DEBUG)
            console.log(`Playlist-Importer: Extension is determined to be (${ext}).`)

        if(ext.match(/(mp3|mp4|wav|ogg|flac)+/g))
            return true;
        return false;
    }

    /**
     * Formats the filenames of songs to something more readable. You can add additional REGEX for other audio extensions.
     * @private
     * @param {string} name 
     */

    _convertToUserFriendly(name){
        name = name.replace(/(%20)+/g, ' ');
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

    _getItemsFromDir(source, path, playlistName, options){
        let dupCheck = game.settings.get('playlist_import', 'enableDuplicateChecking');
        let shouldRepeat = game.settings.get('playlist_import', 'shouldRepeat');
        let logVolume = parseFloat(game.settings.get('playlist_import', 'logVolume'));
        if(logVolume == NaN){
            if(this.DEBUG)
                console.log("Invalid type logVolume")
            return
        }
        logVolume = AudioHelper.inputToVolume(logVolume)
        
        let playlist = game.playlists.entities.find(p => p.name === playlistName);

        return new Promise(async (resolve, reject) => {
            FilePicker.browse(source, path, options).then(async function(resp){
                let localFiles = resp.files;
                for(const fileName of localFiles){
                    const valid = await this._validateFileType(fileName);
                    if(valid){
                        let trackName = this._convertToUserFriendly(this._getBaseName(fileName));
                        let currentList = await game.settings.get('playlist_import', 'songs');
                        
                        if(!dupCheck || currentList[(playlistName + trackName)] != true){ // A weird way of saying always succeed if dupCheck is on otherwise see if the track is in the list
                            if(this.DEBUG)
                                console.log(`Playlist-importer: Song ${trackName} not in list.`)
                            await this._addSong(currentList, trackName, fileName, playlistName, playlist, shouldRepeat, logVolume) 
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

    async _addSong(currentList, trackName, fileName, playlistName, playlist, shouldRepeat, logVolume){
        currentList[(playlistName + trackName)] = true;
        await game.settings.set('playlist_import', 'songs', currentList);    
        await playlist.createEmbeddedEntity("PlaylistSound", {name: trackName, path: fileName, repeat: shouldRepeat, volume: logVolume}, {});     
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
            callback: () => console.log("Playlist-Importer: Prompt Closed ")
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
        let options = {}
        if(source == "s3"){
            options['bucket'] = game.settings.get("playlist_import", "bucket");
        } 

        FilePicker.browse(source, path, options).then(async resp => {
            let localDirs = resp.dirs; 
            for(const dirName of localDirs){
                let success = await this._generatePlaylist(this._convertToUserFriendly(this._getBaseName(dirName)));
                if(this.DEBUG)
                    console.log(`TT: ${dirName}: ${success} on creating playlists`);
            }

            for(const dirName of localDirs){
                await this._getItemsFromDir(source, dirName, this._convertToUserFriendly(this._getBaseName(dirName)), options);   
            }

            if(this.DEBUG)
                console.log("Playlist-Importer: Operation Completed. Thank you!");
            this._playlistCompletePrompt();
        })
    }
}

PlaylistImporterInitializer.initalize();
