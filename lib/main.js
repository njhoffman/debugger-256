const pjson = require('prettyjson-256');
const _ = require('lodash');

const { log } = require('./console');
const { debug } = require('./debugger');
const {
  getConf,
  resetSettings,
  initSettings,
  showColors
} = require('./settings');

/* eslint-disable prefer-destructuring, no-param-reassign */

// TODO: on load check configuration file for errors
// TODO: implement '!' to override children subsystems even if specified

const init = (customSettings) => {
  pjson.init(initSettings(customSettings));
};

const reset = () => {
  pjson.init(resetSettings());
};

const createDebug = (subsystem = '') => ({
  _dbg:  debug.bind(undefined, -1, subsystem),
  fatal: debug.bind(undefined, 0, subsystem),
  error: debug.bind(undefined, 1, subsystem),
  warn:  debug.bind(undefined, 2, subsystem),
  log:   debug.bind(undefined, 3, subsystem),
  info:  debug.bind(undefined, 4, subsystem),
  debug: debug.bind(undefined, 5, subsystem),
  trace: debug.bind(undefined, 6, subsystem),
  showColors,
  init,
  reset
});

let _logN = 0;
const processLine = (line) => {
  let lineOut = line;
  if (_.isFunction(getConf().preprocess)) {
    lineOut = getConf().preprocess(line);
  }

  if (!lineOut) {
    return false;
  }

  _logN += 1;

  const { level, name, subsystem, msg, _logId } = lineOut;
  const ssName = `${name || ''} ${subsystem || ''}`.trim();

  let lvl = 'info';
  if (level && /(_dbg|fatal|error|warn|log|info|debug|trace)/.test(level)) {
    lvl = level;
  } else if (_.isNumber(level)) {
    const bunyanLevels = {
      60: 'fatal', 50: 'error', 40: 'warn', 30: 'info', 20: 'debug', 10: 'trace', 0: 'silly'
    };
    lvl = bunyanLevels[level];
  }

  if (!_logId) {
    _.merge(lineOut, { _logId: _logN });
  }

  const debugLine = createDebug(ssName);
  if (_.isEmpty(lineOut)) {
    return debugLine[lvl](msg);
  }
  return debugLine[lvl](msg, lineOut);
};

/* eslint-enable prefer-destructuring, no-param-reassign */

module.exports = {
  reset,
  init,
  showColors,
  processLine,
  outputLine: log(processLine)
};
