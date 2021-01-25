class PlaylistImporterInitializer {
    constructor() { }

    static initalize() {
        PlaylistImporterInitializer.hookReady();
        PlaylistImporterInitializer.hookRenderPlaylistDirectory();
        PlaylistImporterInitializer.hookRenderSettings();
        PlaylistImporterInitializer.hookDeletePlaylist();
        PlaylistImporterInitializer.hookDeletePlaylistSound();
    }

    static hookRenderPlaylistDirectory() {
        /**
         * Appends a button onto the playlist to import songs.
         */

        Hooks.on("renderPlaylistDirectory", (app, html, data) => {
            const importPlaylistString = game.i18n.localize("PLI.ImportButton");
            const importButton = $(`<button  style="min-width: 96%; margin: 10px 6px;">${importPlaylistString}</button>`);
            if (game.user.isGM || game.user.can("SETTINGS_MODIFY")) {
                html.find(".directory-footer").append(importButton);
                importButton.click((ev) => {
                    PLIMP.playlistImporter.playlistDirectoryInterface();
                });
            }
        });

    }

    static _removeSound(playlistName, soundNames){
        let currentList = game.settings.get("playlist_import", "songs");
        soundNames.forEach(soundName => {
            let trackName = PlaylistImporter._convertToUserFriendly(PlaylistImporter._getBaseName(soundName));
            let mergedName = (playlistName + trackName).toLowerCase()
            if(trackName && playlistName){
                if (currentList[mergedName]){
                    delete currentList[mergedName]
                }
            }
        });
        game.settings.set("playlist_import", "songs", currentList);
    }

    static hookDeletePlaylist(){
        Hooks.on("deletePlaylist", (playlist, flags, id) => {
            let playlistName = playlist.name;
            let soundObjects = playlist.sounds;
            let sounds = []
            for(let i = 0; i < soundObjects.length; ++i){
                sounds.push(soundObjects[i].path);
            }

            PlaylistImporterInitializer._removeSound(playlistName, sounds)
        });
    }
    
    static hookDeletePlaylistSound(){
        Hooks.on("deletePlaylistSound", (playlist, data, flags, id) => {
            let playlistName = playlist.data.name;
            let soundName = data.path;
            PlaylistImporterInitializer._removeSound(playlistName, [soundName])
        });
    }

    static hookRenderSettings() {
        /**
         * Appends a button onto the settings to clear playlist "Hashtable" memory.
         */
        Hooks.on("renderSettings", (app, html) => {
            const clearMemoryString = game.i18n.localize("PLI.ClearMemory");
            const importButton = $(`<button>${clearMemoryString}</button>`);
            // For posterity.
            if (game.user.isGM || game.user.can("SETTINGS_MODIFY")) {
                html.find("button[data-action='players']").after(importButton);
                importButton.click((ev) => {
                    PLIMP.playlistImporter.clearMemoryInterface();
                });
            }
        });
    }

    static hookReady() {
        Hooks.on("ready", () => {
            PLIMP.playlistImporter = new PlaylistImporter();
            PlaylistImporterInitializer._registerSettings();
        });
    }
    
    static _registerSettings() {
        PlaylistImporterConfig.initializeConfigParams();
        PLIMP.PLAYLISTCONFIG.forEach((setting) => {
            game.settings.register(PLIMP.MODULENAME, setting.key, setting.settings);
        });
        let sources = new FilePicker().sources;
        let options = Object.keys(sources);
        game.settings.register("playlist_import", "source", {
            name: game.i18n.localize("PLI.SelectSource"),
            hint: `${game.i18n.localize("PLI.SelectSourceHint")} [${options}]`,
            type: String,
            default: "data",
            scope: "world",
            config: true,
        });
    }
}

class PlaylistImporter {
    constructor() {
        /*  --------------------------------------  */
        /*            Global settings               */
        /*  --------------------------------------  */
        this.DEBUG = false; // Enable to see logs
    }
    /*  --------------------------------------  */
    /*           Helper functions               */
    /*  --------------------------------------  */

    /**
     * Grabs the most recent folder name. Used in playlist naming.
     * @private
     * @param {string} filePath
     */

    static _getBaseName(filePath) {
        return filePath.split("/").reverse()[0];
    }

    /**
     * Validates the audio extension to be of type mp3, wav, ogg, flac or webm.
     * @private
     * @param {string} fileName
     */

    _validateFileType(fileName) {
        let ext = fileName.split(".").pop();
        if (this.DEBUG) console.log(`Playlist-Importer: Extension is determined to be (${ext}).`);

        return !!ext.match(/(mp3|wav|ogg|flac|webm)+/g);

    }

    /**
     *
     * @param match
     * @param p1
     * @param p2
     * @param p3
     * @param offset
     * @param input_string
     * @returns {string}
     * @private
     */
    static _convertCamelCase(match, p1, p2, p3, offset, input_string) {
        let replace, small = ['a', 'an', 'at', 'and', 'but', 'by', 'for', 'if', 'nor', 'on', 'of', 'or', 'so', 'the', 'to', 'yet'];

        if (p3) {
            if (small.includes(p2.toLowerCase())) {
                p2 = p2.toLowerCase();
            }
            replace = p1 + ' ' + p2 + ' ' + p3;
        }
        else {
            replace = p1 + ' ' + p2;
        }

        return replace;
    }

    /**
     * Formats the filenames of songs to something more readable. You can add additional REGEX for other audio extensions.
     * @private
     * @param {string} name
     */

    static _convertToUserFriendly(name) {
        let words = [], small = ['a', 'an', 'at', 'and', 'but', 'by', 'for', 'if', 'nor', 'on', 'of', 'or', 'so', 'the', 'to', 'yet'];
        let regexReplace = new RegExp(game.settings.get("playlist_import", "customRegexDelete"));
        name = decodeURIComponent(name);
        name = name.split(/(.mp3|.mp4|.wav|.ogg|.flac)+/g)[0]
          .replace(regexReplace, '')
          .replace(/[_]+/g, ' ');

        while (name !== name.replace(/([a-z])([A-Z][a-z]*)([A-Z])?/, PlaylistImporter._convertCamelCase)) {
            name = name.replace(/([a-z])([A-Z][a-z]*)([A-Z])?/, PlaylistImporter._convertCamelCase);
        }

        words = name.replace(/\s+/g, ' ').trim().split(' '); // remove extra spaces prior to trimming to remove .toUpperCase() error

        for (let i = 0; i < words.length; i++) {
            if (i === 0 || i === (words.length - 1) || !small.includes(words[i])) {
                try{
                    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
                }
                catch(error){
                    console.log(error);
                    console.log(`Error in attempting to parse song ${name}`);
                }
            }
        }

        name = words.join(' ');

        if (this.DEBUG) console.log(`Playlist-Importer: Converting playlist name to eliminate spaces and extension: ${name}.`);
        return name;
    }

    /**
     * Waits for the creation of a playlist in a separate function for readability.
     * @param {string} playlistName
     */

    _generatePlaylist(playlistName) {
        return new Promise(async (resolve, reject) => {
            const playlistExists = await game.playlists.entities.find((p) => p.name === playlistName);
            if (playlistExists == null) {
                try {
                    await Playlist.create({
                        "name": playlistName,
                        "permission": {
                            "default": 0,
                        },
                        "flags": {},
                        "sounds": [],
                        "mode": 0,
                        "playing": false,
                    });
                    if (this.DEBUG) console.log(`Playlist-Importer: Successfully created playlist: ${playlistName}`);
                    resolve(true);
                } catch (error) {
                    reject(false);
                }
            }
            resolve(false);
        });
    }

    /**
     * Given a path and a playlist name, it will search the path for all files and attempt to add them the created playlist using playlistName.
     * @param {string} source
     * @param {string} path
     * @param {string} playlistName
     */

    _getItemsFromDir(source, path, playlistName, options) {
        let dupCheck = game.settings.get("playlist_import", "enableDuplicateChecking");
        let shouldRepeat = game.settings.get("playlist_import", "shouldRepeat");
        let shouldStream = game.settings.get("playlist_import", "shouldStream");
        let logVolume = parseFloat(game.settings.get("playlist_import", "logVolume"));
        if (isNaN(logVolume)) {
            if (this.DEBUG) console.log("Invalid type logVolume");
            return;
        }
        logVolume = AudioHelper.inputToVolume(logVolume);

        let playlist = game.playlists.entities.find((p) => p.name === playlistName);

        return new Promise(async (resolve, reject) => {
            FilePicker.browse(source, path, options).then(
                async function (resp) {
                    let localFiles = resp.files;
                    for (const fileName of localFiles) {
                        const valid = await this._validateFileType(fileName);
                        if (valid) {
                            let trackName = PlaylistImporter._convertToUserFriendly(PlaylistImporter._getBaseName(fileName));
                            let currentList = await game.settings.get("playlist_import", "songs");

                            if (!dupCheck || currentList[(playlistName + trackName).toLowerCase()] != true) {
                                // A weird way of saying always succeed if dupCheck is on otherwise see if the track is in the list
                                if (this.DEBUG) console.log(`Playlist-importer: Song ${trackName} not in list.`);
                                await this._addSong(currentList, trackName, fileName, playlistName, playlist, shouldRepeat, logVolume, shouldStream);
                            }
                        } else {
                            if (this.DEBUG)
                                console.log(
                                    `Playlist-Importer: Determined ${fileName} to be of an invalid ext. If you believe this to be an error contact me on Discord.`
                                );
                        }
                    }
                    resolve(true);
                }.bind(this)
            );
        });
    }

    async _addSong(currentList, trackName, fileName, playlistName, playlist, shouldRepeat, logVolume, shouldStream) {
        currentList[(playlistName + trackName).toLowerCase()] = true;
        await game.settings.set("playlist_import", "songs", currentList);

        const is07x = game.data.version.split(".")[1] === "7"

        if (is07x)
            await playlist.createEmbeddedEntity("PlaylistSound", { name: trackName, path: fileName, repeat: shouldRepeat, volume: logVolume, streaming: shouldStream }, {});
        else
            await playlist.createEmbeddedEntity("PlaylistSound", { name: trackName, path: fileName, repeat: shouldRepeat, volume: logVolume }, {});
    }

    /**
     * A helper function designed to prompt the player of task completion.
     */
    _playlistCompletePrompt() {
        let playlistComplete = new Dialog({
            title: game.i18n.localize("PLI.OperationFinishTitle"),
            content: `<p>${game.i18n.localize("PLI.OpeartionFinishContent")}</p>`,
            buttons: {
                one: {
                    icon: '<i class="fas fa-check"></i>',
                    label: "",
                    callback: () => { },
                },
            },
            default: "Ack",
            close: () => { },
        });
        playlistComplete.render(true);
    }

    /**
     * A helper function designed to clear the stored history of songs
     */
    _clearSongHistory() {
        game.settings.set("playlist_import", "songs", {});
    }

    /*  --------------------------------------  */
    /*                 Interface                */
    /*  --------------------------------------  */

    clearMemoryInterface() {
        let clearMemoryPrompt = new Dialog({
            title: game.i18n.localize("PLI.ClearMemoryTitle"),
            content: `<p>${game.i18n.localize("PLI.ClearMemoryDescription")}</p>`,
            buttons: {
                one: {
                    label: game.i18n.localize("PLI.ClearMemoryWarning"),
                    callback: () => this._clearSongHistory(),
                },
                two: {
                    label: game.i18n.localize("PLI.CancelOperation"),
                    callback: () => console.log("Playlist-Importer: Canceled"),
                },
            },
            default: "Cancel",
            close: () => console.log("Playlist-Importer: Prompt Closed"),
        });
        clearMemoryPrompt.render(true);
    }

    playlistDirectoryInterface() {
        let playlistPrompt = new Dialog({
            title: game.i18n.localize("PLI.ImportMusicTitle"),
            content: `<p>${game.i18n.localize("PLI.ImportMusicDescription")}</p>`,
            buttons: {
                one: {
                    icon: '<i class="fas fa-check"></i>',
                    label: game.i18n.localize("PLI.ImportMusicLabel"),
                    callback: () =>
                        this.beginPlaylistImport(
                            game.settings.get("playlist_import", "source"),
                            window.Azzu.SettingsTypes.DirectoryPicker.format(game.settings.get("playlist_import", "folderDir"))
                        ),
                },
                two: {
                    icon: '<i class="fas fa-times"></i>',
                    label: game.i18n.localize("PLI.CancelOperation"),
                    callback: () => console.log("Playlist-Importer: Canceled"),
                },
            },
            default: "Cancel",
            close: () => { },
        });
        playlistPrompt.render(true);
    }

    /**
     * Called by the dialogue to begin the importation process. This is the function that starts the process.
     * @param {string} source
     * @param {string} path
     */
    async beginPlaylistImport(source, path) {
        //const fs = require("fs");
        let options = {};
        if (source === "s3") {
            options["bucket"] = game.settings.get("playlist_import", "bucket");
        }

        FilePicker.browse(source, path, options).then(async (resp) => {
            let localDirs = resp.dirs;
            for (const dirName of localDirs) {
                let success = await this._generatePlaylist(PlaylistImporter._convertToUserFriendly(PlaylistImporter._getBaseName(dirName)));
                if (this.DEBUG) console.log(`TT: ${dirName}: ${success} on creating playlists`);
            }

            for (const dirName of localDirs) {
                await this._getItemsFromDir(source, dirName, PlaylistImporter._convertToUserFriendly(PlaylistImporter._getBaseName(dirName)), options);
            }

            if (this.DEBUG) console.log("Playlist-Importer: Operation Completed. Thank you!");
            this._playlistCompletePrompt();
        });
    }
}

PlaylistImporterInitializer.initalize();