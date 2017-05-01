const fs = require('fs');
const path = require('path');
const { defaultsDeep } = require('lodash');
const appRoot = require('app-root-path');

const watchFile = (fileName) => {
  fs.watchFile(fileName, (curr, prev) => {
    conf = JSON.parse(fs.readFileSync(fileName));
    if (conf && conf['_debugger-256']) {
      defaultsDeep(options, conf['_debugger-256']);
    }
  });
};

let options = {
  /* prettyjson-256 options */
  colors:     {
    keys:    { fg:  [0, 2, 1] },
    number:  { grayscale: 11 }
  },
  customColors : {
    bold:                     { grayscale: 23 },
    blue:                     { fg: [0, 0, 4] },
    lightBlue:                { fg: [0, 1, 5] },
    darkBlue:                 { fg: [0, 0, 3] },
    red:                      { fg: [3, 0, 0] },
    lightRed:                 { fg: [5, 0, 0] },
    darkRed:                  { fg: [1, 0, 0] },
    green:                    { fg: [0, 3, 0] },
    lightGreen:               { fg: [0, 5, 0] },
    darkGreen:                { fg: [0, 1, 0] },
    purple:                   { fg: [1, 0, 3] },
    lightPurple:              { fg: [2, 0, 5] },
    darkPurple:               { fg: [1, 0, 1] },
    cyan:                     { fg: [2, 3, 4] },
    lightCyan:                { fg: [2, 5, 5] },
    darkCyan:                 { fg: [1, 2, 3] },
    yellow:                   { fg: [4, 5, 0] },
    orange:                   { fg: [5, 2, 0] },
    white:                    { fg: [0, 3, 0] },
    gray:                     { grayscale: 12 },

    error:                    { fg: [4, 0, 0] },
    warn:                     { fg: [4, 2, 2] },
    log:                      { fg: [0, 2, 4] },
    info:                     { fg: [2, 2, 4] },
    debug:                    { fg: [3, 3, 4] },
    trace:                    { fg: [3, 4, 4] }
  },
  /* debugger-256 options */
  colorTag: 'color'
};

let conf = false;

export const getOptions = () => options;
export const getConf = () => conf;

export let subsystems = [];

export const loadConfFile = () => {
  // TODO: become a good programmer
  const currPath = path.resolve(__dirname, '.debugger-256');
  const rootPath = path.resolve(appRoot.toString(), '.debugger-256');

  if (fs.existsSync(currPath)) {
    watchFile(currPath);
    return JSON.parse(fs.readFileSync(currPath));
  } else if (fs.existsSync(rootPath)) {
    watchFile(rootPath);
    return JSON.parse(fs.readFileSync(rootPath));
  }
  return false;
};

export const initSettings = (customOptions) => {
  conf = loadConfFile();
  if (customOptions) {
    defaultsDeep(options, customOptions);
  } if (conf && conf['_debugger-256']) {
    defaultsDeep(options, conf['_debugger-256']);
  }
};

initSettings();

