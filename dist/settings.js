'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var fs = require('fs');
var path = require('path');
var appRoot = require('app-root-path');

var _require = require('lodash'),
    merge = _require.merge;

var options = exports.options = {
  /* prettyjson-256 options */
  colors: {
    keys: { fg: [0, 2, 1] },
    number: { fg: { grayscale: 11 } }
  },
  customColors: {
    bold: { grayscale: 23 },
    blue: { fg: [0, 0, 4] },
    lightBlue: { fg: [0, 1, 5] },
    darkBlue: { fg: [0, 0, 3] },
    red: { fg: [3, 0, 0] },
    lightRed: { fg: [5, 0, 0] },
    darkRed: { fg: [1, 0, 0] },
    green: { fg: [0, 3, 0] },
    lightGreen: { fg: [0, 5, 0] },
    darkGreen: { fg: [0, 1, 0] },
    purple: { fg: [1, 0, 3] },
    lightPurple: { fg: [2, 0, 5] },
    darkPurple: { fg: [1, 0, 1] },
    cyan: { fg: [2, 3, 4] },
    lightCyan: { fg: [2, 5, 5] },
    darkCyan: { fg: [1, 2, 3] },
    yellow: { fg: [4, 5, 0] },
    orange: { fg: [5, 2, 0] },
    white: { fg: [0, 3, 0] },
    gray: { grayscale: 12 },

    fatal: { fg: [5, 0, 0] },
    error: { fg: [4, 0, 0] },
    warn: { fg: [4, 2, 2] },
    log: { fg: [0, 2, 4] },
    info: { fg: [2, 2, 4] },
    debug: { fg: [3, 3, 4] },
    trace: { fg: [3, 4, 4] }
  },
  /* debugger-256 options */
  colorTag: 'color'
};

var getOptions = exports.getOptions = function getOptions() {
  return options;
};
var subsystems = exports.subsystems = [];
var getSubsystems = exports.getSubsystems = function getSubsystems() {
  return subsystems;
};
var conf = exports.conf = false;
var getConf = exports.getConf = function getConf() {
  return conf;
};

var fileChange = function fileChange(fileName) {
  console.info('\n -- Detected file change in: ' + fileName + ', reinitializing debugger-256');
  exports.conf = conf = loadConfFile();
};

var loadConfFile = exports.loadConfFile = function loadConfFile() {
  // TODO: implement error handling
  var currLocation = path.resolve(__dirname, '.debugger-256');
  var rootLocation = path.resolve(appRoot.toString(), '.debugger-256');
  if (fs.existsSync(currLocation)) {
    !conf && console.info('\n -- Found debugger-256 configuration file: ' + currLocation + ', applying settings and watching for changes');
    fs.watchFile(currLocation, { interval: 500 }, fileChange.bind(undefined, currLocation));
    return JSON.parse(fs.readFileSync(currLocation));
  } else if (fs.existsSync(rootLocation)) {
    !conf && console.info('\n -- Found debugger-256 configuration file: ' + rootLocation + ', applying settings and watching for changes.');
    fs.watchFile(rootLocation, { interval: 500 }, fileChange.bind(undefined, rootLocation));
    return JSON.parse(fs.readFileSync(rootLocation));
  }
  return false;
};

var initSettings = exports.initSettings = function initSettings(customOptions) {
  if (customOptions) {
    merge(options, customOptions);
  } else {
    exports.conf = conf = loadConfFile();
    if (conf && conf['_debugger-256']) {
      merge(options, conf['_debugger-256']);
    }
  }
  return options;
};

initSettings();
//# sourceMappingURL=settings.js.map