/**
 * This is your TypeScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your module, or remove it.
 * Author: [your name]
 * Content License: [copyright and-or license] If using an existing system
 * 					you may want to put a (link to a) license or copyright
 * 					notice here (e.g. the OGL).
 * Software License: [your license] Put your desired license here, which
 * 					 determines how others may use and modify your module
 */
// Import TypeScript modules
import { registerSettings } from "./module/settings.js";
import "./module/hotkeys.js";
import CONSTANTS from "./module/constants.js";
import { dialogWarning, error, log } from "./module/lib/lib.js";
import { initHooks, readyHooks, setupHooks } from "./module/module.js";
/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', function () {
    log(' init ' + CONSTANTS.MODULE_NAME);
    // Assign custom classes and constants here
    // Register custom module settings
    registerSettings();
    // Preload Handlebars templates
    // preloadTemplates();
    // Register custom sheets (if any)
    initHooks();
});
/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
Hooks.once('setup', function () {
    setupHooks();
});
/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', function () {
    // if (!game.modules.get('lib-wrapper')?.active && game.user?.isGM) {
    //     let word = 'install and activate';
    //     if (game.modules.get('lib-wrapper'))
    //         word = 'activate';
    //     throw error(`Requires the 'libWrapper' module. Please ${word} it.`);
    // }
    // if (!game.modules.get('socketlib')?.active && game.user?.isGM) {
    //     let word = 'install and activate';
    //     if (game.modules.get('socketlib'))
    //         word = 'activate';
    //     throw error(`Requires the 'socketlib' module. Please ${word} it.`);
    // }
    // if (!isGMConnected()) {
    //   warn(`Requires a GM to be connected for players to be able to loot item piles.`, true);
    // }
    // Do anything once the module is ready
    readyHooks();
});
/**
 * Initialization helper, to set API.
 * @param api to set to game module.
 */
export function setApi(api) {
    const data = game.modules.get(CONSTANTS.MODULE_NAME);
    data.api = api;
}
/**
 * Returns the set API.
 * @returns Api from games module.
 */
export function getApi() {
    const data = game.modules.get(CONSTANTS.MODULE_NAME);
    return data.api;
}
/**
 * Initialization helper, to set Socket.
 * @param socket to set to game module.
 */
export function setSocket(socket) {
    const data = game.modules.get(CONSTANTS.MODULE_NAME);
    data.socket = socket;
}
/*
 * Returns the set socket.
 * @returns Socket from games module.
 */
export function getSocket() {
    const data = game.modules.get(CONSTANTS.MODULE_NAME);
    return data.socket;
}
