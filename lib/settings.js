const fs = require('fs');
const path = require('path');
const appRoot = require('app-root-path');
const _ = require('lodash');

const { showColors, showSettings } = require('./utils');
const { internalLog } = require('./console');
const version = require('../package.json').version;

let defaultOptions = {
  /* prettyjson-256 options */
  colors : {
    keys   : { fg: [0, 2, 1] },
    number : { fg: 16  }
  },
  customColors : {
    fatal:        { fg: [5, 0, 0] },
    error:        { fg: [4, 0, 0] },
    warn:         { fg: [4, 1, 0] },
    log:          { fg: [1, 2, 4] },
    info:         { fg: [2, 3, 4] },
    debug:        { fg: [3, 3, 4] },
    trace:        { fg: [3, 4, 4] },
    _requestId:   { fg: [2, 2, 2] },
    message:      { fg: [20] }
  },
  /* debugger-256 options */
  colorTag           : 'color',
  filterMaxTag       : 'filterMax',
  pjsonOptionsTag    : 'pjsonOptions',
  showEmpty          : false,
  showColorsOnLoad   : false,
  showSettingsOnLoad : false
};

let options = _.cloneDeep(defaultOptions);
let getOptions = () => options;

let subsystems = [];
const getSubsystems = () => subsystems;
const addSubsystem = (ss) => {
  if (ss && ss.length > 0 && subsystems.indexOf(ss) === -1) {
    subsystems.push(ss);
  }
};

let conf = false;
const getConf = () => {
  if (conf) return conf;
  return loadConfFile();
}

const fileChange = (fileName) => {
  internalLog(`v${version} Detected file change in: ${fileName}, reinitializing debugger-256`);
  loadConfFile();
};

const readConfFile = (loc) => {
  delete require.cache[require.resolve(loc)];
  let confFile = require(loc);
  if (_.has(confFile, `subsystems._env.${process.env.NODE_ENV}`)) {
    const envConf = _.get(confFile, `subsystems._env.${process.env.NODE_ENV}`);
    internalLog(`v${version} assigning settings for environment "${process.env.NODE_ENV}"`);
    confFile = _.merge(confFile, { subsystems: envConf });
  }
  return confFile;
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

const findConfFile = () => {
  // TODO: implement error handling
  const dirs = __dirname.split('/');
  let i = dirs.length;
  while (i > 0) {
    const dirCheck = path.resolve(`/${dirs.slice(1, i).join('/')}`);
    const file1 = path.resolve(dirCheck, '.debugger-256');
    const file2 = path.resolve(dirCheck, '.debugger-256.js');
    if (checkConfLocation(file1)) {
      return file1;
    } else if (checkConfLocation(file2)) {
      return file2;
    }
    i--;
  }
  return false;
};

const loadConfFile = () => {
  const confFile = findConfFile();
  conf = readConfFile(confFile);
  if (_.has(conf, 'settings')) { _.merge(options, conf.settings); }
  if (conf.settings.showColorsOnLoad) {
    showColors(getOptions());
  }
  if (conf.settings.showSettingsOnLoad) {
    showSettings({ options: getOptions(), subsystems: conf.subsystems });
  }
};

const resetSettings = () => {
  subsystems = [];
  options = _.cloneDeep(defaultOptions);
  return options;
};

const initSettings = (customOptions) => {
  exports.loadConfFile();
  if (customOptions) {
    _.merge(options, customOptions);
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
  getSubsystems,
  showColors
};

exports.initSettings();
