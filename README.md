# Playlist importer 

This module aims to simplify the process of adding multiple music tracks to Foundry VTT, doing so in a timely manner.

![example](example.gif)

### Reasoning

If you have a large music library, importing song by song is tedious at best; therefore, a mass import function would cut down on the time it takes to add your files.

### FVTT Version
- Tested on FVTT v0.3.7

NOTE:
1. There is no error checking on the file types during the search. It will be added later, but for now use only audio files or expect unexpected results.
1. Using spaces in folder names will result in importation issues. Spaces in filenames should be okay.
1. I've tested this on over 11.4GB of music files all in one import. It will work on sizes this large; however, it appears to cause sluggish reactions when trying to select a song to play. Likely there are far too many songs in this case. TLDR: Import an excessive amounts of songs at your own possible speed costs.

### Installation Instructions

To install playlist-import, do the following:

1. [Download the zip file](https://github.com/JacobMcAuley/playlist_import/blob/master/playlist_import.zip)
2. Extract the folder to your 'public/modules' in Foundry VTT.
3. Reload your application.

### Feedback

If you notice any errors or have any suggestions, please let me know on discord! (JacobMcAuley#3461)

