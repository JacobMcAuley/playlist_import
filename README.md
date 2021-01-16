![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/jacobmcauley/playlist_import) 
![GitHub Releases](https://img.shields.io/github/downloads/JacobMcAuley/playlist_import/latest/total) 

# Playlist importer 

This module aims to simplify the process of adding multiple music tracks to Foundry VTT, allowing for bulk importation of songs.

![example](imgs/example.gif)

See an additional sample under long-example.gif!
### Reasoning

If you're like me, you probably enjoy amassing a large collection of songs to play for your players! However, importing your songs one at a time can be sluggish and time consuming. Playlist importer allows you to bulk import all of your songs!

### Features
1. Allows for quick importation of songs into FVTT
1. Only adds songs that haven't been added already (can be disabled) . NOTE: This applies only for songs added by Playlist-importer 


### FVTT Version
- Tested on FVTT v0.5.5. Due to using Setting-Extender this is a breaking update to previous versions. If you use a older version of playlist importer, do not update if you're not on v0.5.4+


### It's a feature not a bug!
Please read the following, as it may answer any questions as to unexpected behavior.

NOTE:
1. Currently only .mp3, .mp4, .ogg, .wav, and .flac files are imported. All other types are excluded. 
1. Organization is force upon you! This means, that when you select your base directory in which to import, only folders within the base directory are checked, not the files. In otherwords, you must subdivide your music into folders inside the base directory.
1. Songs added by playlist-importer will be excluded from being added again by the import function. This means, songs names should be unique! Make sure to avoid duplicate names across folders.
1. Nested folders will result in unsuccessful importations. This will be addressed in future builds
1. For general efficiency questions, refer to the "Efficiency" section below. 
1. Spaces in folder names should no longer cause issues. Please contact me if they cause trouble.



### Installation Instructions

To install playlist-import, do the following:

1. [Download the zip file](https://github.com/JacobMcAuley/playlist_import/archive/master.zip)
2. Extract the folder to your '/modules' folder in Foundry VTT. (location varies based off your path)
3. Reload your application.
4. Enable within FVTT

Auto-Installation Instructions:

1. Copy this link: https://raw.githubusercontent.com/JacobMcAuley/playlist_import/master/module.json
2. Open FoundryVTT and navigate to Add-On Modules
3. Select "Install Module" and paste link into textbox.
4. Click "Install" and watch as the mod is installed!
5. Enable within FVTT

### Usage

*Note*: The paths are vague, as you may have a different data path for your instance of FoundryVTT. If you have questions, feel free to message me.
1. Download and install the mod, then enable it on Foundry.
2. Inside of your "/FoundryVTT/Data/" folder, create a new folder called "music" (or any category you prefer). 
3. Inside of your module settings, navigate to Playlist import and select the desire base directory (music in this example). 
    1. Note 1: If using S3, The Forge, or something similar be sure to select the proper source in the settings
    2. Note 2: If using S3 specifically, please name the bucket you are using within the "bucket" section of the playlist-importer settings. If you're not using S3, you can ignore this option.
4. Inside of your "/FoundryVTT/Data/music" folder, you *must* create subfolders, perhaps with genres and types.
5. Place your music files inside the corresponding folder names (Refer to structure below)
6. Inside of FoundryVTT, select the playlist sidebar tab.
7. Click "Playlist Import" to receive a conformation prompt. 
8. Select "Begin Import" to wait for imports to finish.
9. A prompt will appear confirming task completion, confirm, and enjoy the music!

### Example Structure 

```
    | /FoundryVTT/Data
    | 
    |---> /music <----- This should be selected as the directory
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

### Attributions

Credit for the directory browser goes to [Azzurite](https://gitlab.com/foundry-azzurite/settings-extender) and his wonderful setting extender. It's a great tool for any module developers who want to extend the base settings for modules.

Thanks to Ariphaos for their help with creating a more user friendly naming convention when importing playlists! 

Thanks to Sciguymjm for all the suggestions for improvements to the importer!
Thanks to users JJBocanegra, Jlanatta, and JMMarchant for assisting in the development of Playlist Importer.


### Language Translations

Spanish: Thanks to Lozalojo for providing the Spanish translation.

### Efficiency

Songs are added to a generalized hashtable that is checked each time a song is asked to be added. In this implementation, I use the name of the song as the key in which to add to the hashtable. This is the primary reason that unique song names should be used. When attempting to add a song, the hashtable is checked to see if an entry has already been added. Given the notion of hashtables, this should be constant time and at worse O(n) time (if identical song names are used) as it degrades to a list. 

This leaves us with the remainder of the operations. Generally hand waiving the API call to add to the playlist as constant time, since it should be adding to the database of songs, we can assume that remaining operations are roughly O(N). 

As such here is the plotted time complexity graph for up to 525 songs added at a time. You can see an .html file generated by plotly in images, if you're interested. 

![Time Complexity Graph](imgs/Plot.png)

Note, because we've assumed that checking if a file exists  is constant time, the running time is still approx O(N) as the operation to add scales off the number of files.

Additionally, you times should be faster! To test this, file operations were run on an old HDD approx ~6 years old. This likely means that you should experience better times. 

### Feedback

If you notice any errors or have any suggestions, please let me know on discord! (JacobMcAuley#3461)

