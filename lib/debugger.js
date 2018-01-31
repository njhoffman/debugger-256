const pjson = require('prettyjson-256');
const { has, get, keys, each, isObject, isEmpty, isArray, isNumber, last } = require('lodash');

const { log } = require('./console');
const parseMessages = require('./parser');
const {
  getOptions,
  addSubsystem,
  getConf,
  resetSettings,
  initSettings } = require('./settings');

// TODO: on load check configuration file for errors
// TODO: implement '!' to override children subsystems even if specified

const findLevel = (subsystem, conf, depth, level) => {
  const curr = subsystem.slice(0, depth);
  const next = subsystem.length > depth ? subsystem.slice(0, depth + 1) : null;
  if (has(conf, curr)) {
    if (isNumber(get(conf, curr)) || isArray(get(conf, curr))) {
      return get(conf, curr);
    } else if (subsystem.length + 1 > depth && has(conf, next)) {
      level = findLevel(subsystem, conf, ++depth, level);
    } else if (isNumber(get(conf, curr.concat('*'))) ||
      isArray(get(conf, curr.concat(['*'])))) {
      return get(conf, curr.concat('*'));
    }
  }
  return level;
};


const debug = (level, subsystem, ...messages) => {
  let settings = getOptions();
  const oldDepth = settings.depth;
  const lastMessage = last(messages);

  /* TODO: make this overwritten by DEBUG=* environment variable
    nested subsystems delineated by :'s or spaces (app:routes:admin)
    set as single number for log level, two numbers comma separated to indicate object logging depth */
  let confLevel;
  if (isObject(getConf())) {
    confLevel = findLevel(subsystem.split(/[: ]/), getConf(), 1, 6);
    // if defined as an array, first number is level second number is depth
    if (isArray(confLevel)) {
      settings.depth = confLevel.length === 2 ? confLevel[1] : settings.depth;
      confLevel = confLevel[0];
    }
    if (level >= 0 && level > confLevel) {
      return;
    }
  }

  const { filterMaxTag } = getOptions();
  if (has(lastMessage, filterMaxTag)) {
    const filterMax = parseInt(get(lastMessage, filterMaxTag));
    if (keys(lastMessage).length > 1) {
      delete lastMessage[filterMaxTag];
    } else {
      messages.pop();
    }
    if (isNumber(filterMax) && confLevel > filterMax) {
      return;
    }
  }

  const { pjsonOptionsTag } = getOptions();
  if (has(lastMessage, pjsonOptionsTag)) {
    settings = Object.assign({}, settings, lastMessage[pjsonOptionsTag]);
    if (keys(lastMessage).length > 1) {
      delete lastMessage[pjsonOptionsTag];
    } else {
      messages.pop();
    }
  }
  addSubsystem(subsystem);

  const subObj = level === 0
    ? { fatal: subsystem }
    : level === 1
    ? { error: subsystem }
    : level === 2
    ? { warn: subsystem }
    : level === 4
    ? { info: subsystem }
    : level === 5
    ? { debug: subsystem }
    : level === 6
    ? { trace: subsystem }
    : { log: subsystem };

  // show errors even if depth restriction set
  if (level <= 1) {
    settings.depth = -1;
  }

  let render = pjson.init(settings);
  let reqLog = false;
  if (messages[1] && messages[1]._requestIP) {
    reqLog = messages[1]._requestIP + ' ' +
      (messages[1]._requestUser || messages[1]._requestLocation || messages[1]._requestID);
  }

  if (reqLog) {
    messages[0] += render({ _requestId: ` (${reqLog})` });
    delete messages[1]._requestID;
    delete messages[1]._requestIP;
    delete messages[1]._requestLocation;
    delete messages[1]._requestUser;
    isEmpty(messages[1]) && messages.splice(1, 1);
  }
  log('  ' + render(subObj) + parseMessages(messages, subsystem, render));
  settings.depth = oldDepth;
};

const showColors = () => {
  let render = pjson.init(getOptions());
  each(keys(getOptions().customColors), (key) => {
    log(parseMessages([ `%Custom Color: ${key}%`, { color: key } ], '', render));
  });
};

const init = (customSettings) => {
  pjson.init(initSettings(customSettings));
};

const reset = () => {
  pjson.init(resetSettings());
};

const createDebug = (subsystem = '') => {
  return {
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
  };
};

exports = {
  reset,
  init,
  showColors
};

module.exports = createDebug;
