const fs = require('fs');
const path = require('path');
const appRoot = require('app-root-path');
const { merge, cloneDeep, has, get, assign } = require('lodash');
const { internalLog } = require('./console');
const version = require('../package.json').version;

let defaultOptions = {
  /* prettyjson-256 options */
  colors:     {
    keys:    { fg: [0, 2, 1] },
    number:  { fg: 16  }
  },
  customColors : {
    fatal:                    { fg: [5, 0, 0] },
    error:                    { fg: [4, 0, 0] },
    warn:                     { fg: [4, 1, 0] },
    log:                      { fg: [1, 2, 4] },
    info:                     { fg: [2, 3, 4] },
    debug:                    { fg: [3, 3, 4] },
    trace:                    { fg: [3, 4, 4] },
    _requestId:               { fg: [2, 2, 2] }
  },
  /* debugger-256 options */
  colorTag: 'color',
  filterMaxTag: 'filterMax',
  pjsonOptionsTag: 'pjsonOptions',
  showEmpty: false
};

let options = cloneDeep(defaultOptions);
let getOptions = () => options;

let subsystems = [];
const getSubsystems = () => subsystems;
const addSubsystem = (ss) => {
  if (ss && ss.length > 0 && subsystems.indexOf(ss) === -1) {
    subsystems.push(ss);
  }
};

let conf = false;
const getConf = () => conf;

const fileChange = (fileName) => {
  internalLog(`v${version} Detected file change in: ${fileName}, reinitializing debugger-256`);
  conf = loadConfFile();
};

const readConfFile = (loc) => {
  const content = fs.readFileSync(loc);
  try {
    conf = JSON.parse(content);
    if (has(conf, `_env.${process.env.NODE_ENV}`)) {
      const envConf = get(conf, `_env.${process.env.NODE_ENV}`);
      conf = assign(conf, envConf);
    }
    if (has(conf, '_debugger-256')) {
      merge(options, conf['_debugger-256']);
    }
    return conf;
  } catch (e) {
    internalLog('Error parsing configuration file', e);
    return false;
  }
};

const checkConfLocation = (loc) => {
  if (fs.existsSync(loc)) {
    !conf && internalLog(`v${version} Found debugger-256 configuration file: ${loc}, applying settings and watching for changes`);
    fs.unwatchFile(loc);
    fs.watchFile(loc, { interval: 500 }, fileChange.bind(undefined, loc));
    return true;
  }
  return false;
};

const loadConfFile = () => {
  // TODO: implement error handling
  const dirs = __dirname.split('/');
  let i = dirs.length;
  while (i > 0) {
    const dirCheck = path.resolve(`/${dirs.slice(1, i).join('/')}`, '.debugger-256');
    if (checkConfLocation(dirCheck)) {
      return readConfFile(dirCheck);
    }
    i--;
  }
  return false;
};

const resetSettings = () => {
  subsystems = [];
  options = cloneDeep(defaultOptions);
  return options;
};

const initSettings = (customOptions) => {
  exports.loadConfFile();
  if (customOptions) {
    merge(options, customOptions);
  }
  return options;
};


exports = module.exports = {
  initSettings,
  resetSettings,
  loadConfFile,
  getConf,
  addSubsystem,
  getOptions,
  getSubsystems
};

exports.initSettings();
