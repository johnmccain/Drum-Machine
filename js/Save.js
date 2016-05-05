/**
 * @author John McCain
 * @version  1.0
 */

/**
 * Returns an object representing the current state of the drum machine (for pattern saving/sharing)
 * @return {object} obj - the object representing the current state of the drum machine
 */
function toObject() {
    var obj = {};
    var instrumentObjects = Array();
    for (var i = 0; i < instruments.length; ++i) {
        instrumentObjects[i] = instruments[i].toObject();
    }
    obj.instruments = instrumentObjects;
    obj.gain = masterVolume.gain.value.toFixed(2);
    if (tempo % 0.01 < 0.009) {
        obj.tempo = tempo.toFixed(2);
    } else {
        obj.tempo = tempo;
    }
    obj.mode = sequenceMode;
    return obj;
}

/**
 * Loads a scene (including all settings) from an object
 * @param obj {object} - the scene to load from
 */
function loadFromObject(obj) {
    if (!obj || !obj.gain) {
        console.error('Error: invalid object');
        alert('Error: invalid scene settings');
        return;
    }
    for (var i = 0; i < instruments.length; ++i) {
        instruments[i].fromObject(obj.instruments[i]);
    }
    masterVolume.gain.value = obj.gain;
    jMasterVolumeKnob.position = obj.gain * 300;
    jMasterVolumeKnob.rotate(0);
    setTempo(obj.tempo);
    setSequenceMode(obj.mode);
}

/**
 * Pushes a get parameter to the URL, removing previous get parameters if they exist
 * @param param {string} - the parameter to push to get with key 'p'
 */
function pushGet(param) {
    var url = window.location.href;
    if (url.indexOf('?p=') > 0) {
        url = url.substring(0, url.indexOf('?p='));
    }
    window.history.pushState({
        "html": document.documentElement.outerHTML,
        "pageTitle": document.title
    }, "", url + '?p=' + param);
}

/**
 * Pulls a get parameter under key 'p' from the url
 * @return obj {object | undefined} - the object pulled from get, undefined if no object as 'p' is a get parameter or the parameter is not a valid JSON object
 */
function pullGet() {
    var url = window.location.href;
    if (url.indexOf('?p=') > 0) {
        try {
            var str = decompressSceneData(replaceSymbols(url.substring(url.indexOf('?p=') + 3, url.length)));
            return JSON.parse(str);
        } catch (e) {
            console.log('Error parsing the get parameter');
            return undefined;
        }
    } else {
        return undefined;
    }
}

/**
 * Fixes any formatting issues in the JSON object due to being passed in through the url
 * @return url {string} - The fixed url
 */
function replaceSymbols(url) {
    url = url.replace(/%22/gi, '"');
    url = url.replace(/%7B/gi, '{');
    url = url.replace(/%7D/gi, '}');
    url = url.replace(/%3A/gi, ':');
    url = url.replace(/%2C/gi, ',');
    return url;
}

/**
 * Attempts to load a scene from a serialized jSON object in the url
 */
function loadScene() {
    var obj = pullGet();
    if (obj) {
        loadFromObject(obj);
    }
}

/**
 * Saves a scene (including all settings) to a serialized JSON object in the url
 */
function saveScene() {
    pushGet(compressSceneData(JSON.stringify(toObject())));
}

/**
 * Compresses a url of scene data
 * @param data {string} - The data to be compressed
 * @return data {string} - The compressed data
 */
function compressSceneData(data) {
    data = data.replace(/\{/g, 'v');
    data = data.replace(/\}/g, 'w');
    data = data.replace(/\"/g, 'x');
    data = data.replace(/\:/g, 'y');
    data = data.replace(/\,/g, 'z');
    data = data.replace(/\[/g, 'q');
    data = data.replace(/\]/g, 'r');
    data = data.replace(/instruments/g, 'i');
    data = data.replace(/mode/g, 'm');
    data = data.replace(/tempo/g, 't');
    data = data.replace(/gain/g, 'g');
    data = data.replace(/knobs/g, 'k');
    data = data.replace(/sequence/g, 's');
    return data;
}

/**
 * Decompresses a url of scene data
 * @param data {string} - The data to be decompressed
 * @return data {string} - The decompressed data
 */
function decompressSceneData(data) {
    data = data.replace(/v/g, '{');
    data = data.replace(/w/g, '}');
    data = data.replace(/x/g, '"');
    data = data.replace(/y/g, ':');
    data = data.replace(/z/g, ',');
    data = data.replace(/q/g, '[');
    data = data.replace(/r/g, ']');
    data = data.replace(/s/g, 'sequence');
    data = data.replace(/i/g, 'instruments');
    data = data.replace(/(m)(?!ent)/g, 'mode');
    data = data.replace(/(t)(?!rum|s)/g, 'tempo');
    data = data.replace(/g/g, 'gain');
    data = data.replace(/k/g, 'knobs');
    console.log('decompressed: ' + data);
    return data;
}

/**
 * Compresses an instrument beat sequence to a hexadecimal value
 * @param sequence {Array} - The sequence to compress (should be a 2x16 array of integers)
 * @return str {string} - The compressed string of hexadecimal characters that represent the input sequence
 */
function compressSequence(sequence) {
    var str = '';
    for (var i = 0; i < 2; ++i) {
        for (var j = 0; j < 16; ++j) {
            str += sequence[i][j];
        }
    }
    var num = parseInt(str, 2);
    str = num.toString(16);
    if (str.length < 8) {
        str = leftPad(str, '0', 8 - str.length);
    }
    return str;
}

/**
 * Decompresses an instrument beat sequence from a hexadecimal value
 * @param str {string} - The compressed string of hexadecimal characters that represent the sequence
 * @return sequence {Array} - The decompressed sequence (should be a 2x16 array of integers)
 */
function decompressSequence(str) {
    var num = parseInt(str, 16);
    str = num.toString(2);
    var sequence = Array();
    for (var i = 0; i < 2; ++i) {
        sequence[i] = Array();
        for (var j = 0; j < 16; ++j) {
            sequence[i][j] = parseInt(str.charAt(i * 16 + j), 10);
        }
    }
    return sequence;
}

/**
 * Pads a string on the left with the specified string or character a specified number of times
 * @param str {String} - The string to left pad
 * @param pad {String} - The pad to use
 * @param num {number} - The number of times to pad
 * @return str {String} - The padded string
 */
function leftPad(str, pad, num) {
    for (var i = 0; i < num; ++i) {
        str = pad + str;
    }
    return str;
}
