# Playlist importer 

This module aims to simplify the process of adding multiple music tracks to Foundry VTT, doing so in a timely manner.

![example](example.gif)

### Reasoning

If you have a large music library, importing song by song is tedious at best; therefore, a mass import function would cut down on the time it takes to add your files.

### FVTT Version
- Tested on FVTT v0.3.7

NOTE:
1. Currently only .mp3, .mp4, .ogg, and .wav files are imported. All other types are excluded. 
1. If used twice in a row, duplicate songs will be added. I recommend doing it in bulk and deleting all playlists and reimporting for adding new songs. 
1. Using spaces in **folder** names will result in importation issues. Spaces in *file names* should be okay.
1. I've tested this on over 11.4GB of music files all in one import, so far as my tests indicates, everything seems to work well! However, importing mass amounts of songs while players are connected seems to result in sluggish playback. I recommend importing while you are alone.

### Installation Instructions

To install playlist-import, do the following:

1. [Download the zip file](https://github.com/JacobMcAuley/playlist_import/blob/master/playlist_import.zip)
2. Extract the folder to your 'public/modules' in Foundry VTT.
3. Reload your application.

Auto-Installation Instructions:

1. Copy this link: https://raw.githubusercontent.com/JacobMcAuley/playlist_import/master/module.json
2. Open FoundryVTT and navigate to Add-On Modules
3. Select "Install Module" and paste link into textbox.
4. Click "Install" and watch as the mod is installed!

### Usage

1. Download and install the mod, then enable it on Foundry.
2. Inside of your "/Foundry/resources/app/public/" folder, create a new folder called "music".
3. Inside of your "/Foundry/resources/app/public/music" folder, you may create subfolders with genres and types.
4. Place your music files inside the corresponding folder names (Refer to structure below)
5. Inside of FoundryVTT, select the playlist sidebar tab.
6. Click "Playlist Import" to recieve a conformation prompt. 
7. Select "Begin Import" to wait for imports to finish.
8. A prompt will appear confirming task completion, confirm, and enjoy the music!

### Example Structure 

```
    | /Foundry/resources/app/public
    | 
    |---> /music
    |     |
    |     |------> /battle_songs
    |     |        |
    |     |        |----> cool_battle.mp3
    |     |        |
    |     |------> /epic_songs
    |     |        |
    |     |        |----> epic_battle.mp3
    |     |        |----> last_stand.mp4
    |     |------> /tavern_songs
    |     |        |
    |     |        |----> gnarly_gnomes.mp3
    |     |        |
    |     |------> /peaceful_songs
    |     |        |
    |     |        |----> safety.mp3
    |     |        |----> just_kidding.mp4
    
```

### Recommendations

Consider checking out the following projects:

1. [A youtube music downloader by YTDL-org](https://github.com/ytdl-org/youtube-dl)
1. [A spotify music downloader by ritiek](https://github.com/ritiek/spotify-downloader)

Using the following projects, you should be able to download music for your FVTT games. Simply sort the songs into categories and place them into your /Foundry/resources/app/public/music folder and allow the playlist importer to do the rest!


### Feedback

If you notice any errors or have any suggestions, please let me know on discord! (JacobMcAuley#3461)

