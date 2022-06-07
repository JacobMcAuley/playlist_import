import CONSTANTS from '../constants.js';
// =============================
// Module Generic function
// =============================
export async function getToken(documentUuid) {
    const document = await fromUuid(documentUuid);
    //@ts-ignore
    return document?.token ?? document;
}
export function getOwnedTokens(priorityToControlledIfGM) {
    const gm = game.user?.isGM;
    if (gm) {
        if (priorityToControlledIfGM) {
            const arr = canvas.tokens?.controlled;
            if (arr && arr.length > 0) {
                return arr;
            }
            else {
                return canvas.tokens?.placeables;
            }
        }
        else {
            return canvas.tokens?.placeables;
        }
    }
    if (priorityToControlledIfGM) {
        const arr = canvas.tokens?.controlled;
        if (arr && arr.length > 0) {
            return arr;
        }
    }
    let ownedTokens = canvas.tokens?.placeables.filter((token) => token.isOwner && (!token.data.hidden || gm));
    if (ownedTokens.length === 0 || !canvas.tokens?.controlled[0]) {
        ownedTokens = (canvas.tokens?.placeables.filter((token) => (token.observer || token.isOwner) && (!token.data.hidden || gm)));
    }
    return ownedTokens;
}
export function is_UUID(inId) {
    return typeof inId === 'string' && (inId.match(/\./g) || []).length && !inId.endsWith('.');
}
export function getUuid(target) {
    // If it's an actor, get its TokenDocument
    // If it's a token, get its Document
    // If it's a TokenDocument, just use it
    // Otherwise fail
    const document = getDocument(target);
    return document?.uuid ?? false;
}
export function getDocument(target) {
    if (target instanceof foundry.abstract.Document)
        return target;
    return target?.document;
}
export function is_real_number(inNumber) {
    return !isNaN(inNumber) && typeof inNumber === 'number' && isFinite(inNumber);
}
export function isGMConnected() {
    return !!Array.from(game.users).find((user) => user.isGM && user.active);
}
export function isGMConnectedAndSocketLibEnable() {
    return isGMConnected(); // && !game.settings.get(CONSTANTS.MODULE_NAME, 'doNotUseSocketLibFeature');
}
export function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export function isActiveGM(user) {
    return user.active && user.isGM;
}
export function getActiveGMs() {
    return game.users?.filter(isActiveGM);
}
export function isResponsibleGM() {
    if (!game.user?.isGM)
        return false;
    return !getActiveGMs()?.some((other) => other.data._id < game.user?.data._id);
}
export function firstGM() {
    return game.users?.find((u) => u.isGM && u.active);
}
export function isFirstGM() {
    return game.user?.id === firstGM()?.id;
}
export function firstOwner(doc) {
    /* null docs could mean an empty lookup, null docs are not owned by anyone */
    if (!doc)
        return undefined;
    const permissionObject = (doc instanceof TokenDocument ? doc.actor?.data.permission : doc.data.permission) ?? {};
    const playerOwners = Object.entries(permissionObject)
        .filter(([id, level]) => !game.users?.get(id)?.isGM && game.users?.get(id)?.active && level === 3)
        .map(([id, level]) => id);
    if (playerOwners.length > 0) {
        return game.users?.get(playerOwners[0]);
    }
    /* if no online player owns this actor, fall back to first GM */
    return firstGM();
}
/* Players first, then GM */
export function isFirstOwner(doc) {
    return game.user?.id === firstOwner(doc)?.id;
}
// ================================
// Logger utility
// ================================
// export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3
export function debug(msg, args = '') {
    if (game.settings.get(CONSTANTS.MODULE_NAME, 'debug')) {
        console.log(`DEBUG | ${CONSTANTS.MODULE_NAME} | ${msg}`, args);
    }
    return msg;
}
export function log(message) {
    message = `${CONSTANTS.MODULE_NAME} | ${message}`;
    console.log(message.replace('<br>', '\n'));
    return message;
}
export function notify(message) {
    message = `${CONSTANTS.MODULE_NAME} | ${message}`;
    ui.notifications?.notify(message);
    console.log(message.replace('<br>', '\n'));
    return message;
}
export function info(info, notify = false) {
    info = `${CONSTANTS.MODULE_NAME} | ${info}`;
    if (notify)
        ui.notifications?.info(info);
    console.log(info.replace('<br>', '\n'));
    return info;
}
export function warn(warning, notify = false) {
    warning = `${CONSTANTS.MODULE_NAME} | ${warning}`;
    if (notify)
        ui.notifications?.warn(warning);
    console.warn(warning.replace('<br>', '\n'));
    return warning;
}
export function error(error, notify = true) {
    error = `${CONSTANTS.MODULE_NAME} | ${error}`;
    if (notify)
        ui.notifications?.error(error);
    return new Error(error.replace('<br>', '\n'));
}
export function timelog(message) {
    warn(Date.now(), message);
}
export const i18n = (key) => {
    return game.i18n.localize(key)?.trim();
};
export const i18nFormat = (key, data = {}) => {
    return game.i18n.format(key, data)?.trim();
};
// export const setDebugLevel = (debugText: string): void => {
//   debugEnabled = { none: 0, warn: 1, debug: 2, all: 3 }[debugText] || 0;
//   // 0 = none, warnings = 1, debug = 2, all = 3
//   if (debugEnabled >= 3) CONFIG.debug.hooks = true;
// };
export function dialogWarning(message, icon = 'fas fa-exclamation-triangle') {
    return `<p class="${CONSTANTS.MODULE_NAME}-dialog">
        <i style="font-size:3rem;" class="${icon}"></i><br><br>
        <strong style="font-size:1.2rem;">${CONSTANTS.MODULE_NAME}</strong>
        <br><br>${message}
    </p>`;
}
// =========================================================================================
export function cleanUpString(stringToCleanUp) {
    // regex expression to match all non-alphanumeric characters in string
    const regex = /[^A-Za-z0-9]/g;
    if (stringToCleanUp) {
        return i18n(stringToCleanUp).replace(regex, '').toLowerCase();
    }
    else {
        return stringToCleanUp;
    }
}
export function isStringEquals(stringToCheck1, stringToCheck2, startsWith = false) {
    if (stringToCheck1 && stringToCheck2) {
        const s1 = cleanUpString(stringToCheck1) ?? '';
        const s2 = cleanUpString(stringToCheck2) ?? '';
        if (startsWith) {
            return s1.startsWith(s2) || s2.startsWith(s1);
        }
        else {
            return s1 === s2;
        }
    }
    else {
        return stringToCheck1 === stringToCheck2;
    }
}
/**
 * The duplicate function of foundry keep converting my string value to "0"
 * i don't know why this methos is a brute force solution for avoid that problem
 */
export function duplicateExtended(obj) {
    try {
        //@ts-ignore
        if (structuredClone) {
            //@ts-ignore
            return structuredClone(obj);
        }
        else {
            // Shallow copy
            // const newObject = jQuery.extend({}, oldObject);
            // Deep copy
            // const newObject = jQuery.extend(true, {}, oldObject);
            return jQuery.extend(true, {}, obj);
        }
    }
    catch (e) {
        return duplicate(obj);
    }
}
// =========================================================================================
/**
 *
 * @param obj Little helper for loop enum element on typescript
 * @href https://www.petermorlion.com/iterating-a-typescript-enum/
 * @returns
 */
export function enumKeys(obj) {
    return Object.keys(obj).filter((k) => Number.isNaN(+k));
}
/**
 * @href https://stackoverflow.com/questions/7146217/merge-2-arrays-of-objects
 * @param target
 * @param source
 * @param prop
 */
export function mergeByProperty(target, source, prop) {
    for (const sourceElement of source) {
        const targetElement = target.find((targetElement) => {
            return sourceElement[prop] === targetElement[prop];
        });
        targetElement ? Object.assign(targetElement, sourceElement) : target.push(sourceElement);
    }
    return target;
}
/**
 * Returns the first selected token
 */
export function getFirstPlayerTokenSelected() {
    // Get first token ownted by the player
    const selectedTokens = canvas.tokens?.controlled;
    if (selectedTokens.length > 1) {
        //iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
        return null;
    }
    if (!selectedTokens || selectedTokens.length == 0) {
        //if(game.user.character.data.token){
        //  //@ts-ignore
        //  return game.user.character.data.token;
        //}else{
        return null;
        //}
    }
    return selectedTokens[0];
}
/**
 * Returns a list of selected (or owned, if no token is selected)
 * note: ex getSelectedOrOwnedToken
 */
export function getFirstPlayerToken() {
    // Get controlled token
    let token;
    const controlled = canvas.tokens?.controlled;
    // Do nothing if multiple tokens are selected
    if (controlled.length && controlled.length > 1) {
        //iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
        return null;
    }
    // If exactly one token is selected, take that
    token = controlled[0];
    if (!token) {
        if (!controlled.length || controlled.length == 0) {
            // If no token is selected use the token of the users character
            token = canvas.tokens?.placeables.find((token) => token.data._id === game.user?.character?.data?._id);
        }
        // If no token is selected use the first owned token of the users character you found
        if (!token) {
            token = canvas.tokens?.ownedTokens[0];
        }
    }
    return token;
}
function getElevationToken(token) {
    const base = token.document.data;
    return getElevationPlaceableObject(base);
}
function getElevationWall(wall) {
    const base = wall.document.data;
    return getElevationPlaceableObject(base);
}
function getElevationPlaceableObject(placeableObject) {
    let base = placeableObject;
    if (base.document) {
        base = base.document.data;
    }
    const base_elevation =
    //@ts-ignore
    typeof _levels !== 'undefined' &&
        //@ts-ignore
        _levels?.advancedLOS &&
        (placeableObject instanceof Token || placeableObject instanceof TokenDocument)
        ? //@ts-ignore
            _levels.getTokenLOSheight(placeableObject)
        : base.elevation ??
            base.flags['levels']?.elevation ??
            base.flags['levels']?.rangeBottom ??
            base.flags['wallHeight']?.wallHeightBottom ??
            0;
    return base_elevation;
}
// =============================
// Module specific function
// =============================
