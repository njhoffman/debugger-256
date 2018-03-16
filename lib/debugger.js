const pjson = require('prettyjson-256');
const _ = require('lodash');

const { log } = require('./console');
const parseMessages = require('./parser');
const {
  getOptions,
  addSubsystem,
  getConf,
  resetSettings,
  initSettings
} = require('./settings');

// TODO: on load check configuration file for errors
// TODO: implement '!' to override children subsystems even if specified

const findLevel = (subsystem, conf, depth, level) => {
  const curr = subsystem.slice(0, depth);
  const next = subsystem.length > depth ? subsystem.slice(0, depth + 1) : null;
  if (_.has(conf, curr)) {
    if (_.isNumber(_.get(conf, curr)) || _.isArray(_.get(conf, curr))) {
      return _.get(conf, curr);
    } else if (subsystem.length + 1 > depth && _.has(conf, next)) {
      level = findLevel(subsystem, conf, ++depth, level);
    } else if (_.isNumber(_.get(conf, curr.concat('*'))) ||
      _.isArray(_.get(conf, curr.concat(['*'])))) {
      return _.get(conf, curr.concat('*'));
    }
  }
  return level;
};

const debug = (level, subsystem, ...messages) => {
  let settings = getOptions();
  const oldDepth = settings.depth;
  const lastMessage = _.last(messages);

  /* TODO: make this overwritten by DEBUG=* environment variable
    nested subsystems delineated by :'s or spaces (app:routes:admin)
    set as single number for log level, two numbers comma separated to indicate object logging depth */
  let confLevel;
  if (getConf() && _.isObject(getConf().subsystems)) {
    confLevel = findLevel(subsystem.split(/[: ]/), getConf().subsystems, 1, 6);
    // if defined as an array, first number is level second number is depth
    if (_.isArray(confLevel)) {
      settings.depth = confLevel.length === 2 ? confLevel[1] : settings.depth;
      confLevel = confLevel[0];
    }
    if (level >= 0 && level > confLevel) {
      return;
    }
  }

  const { filterMaxTag } = getOptions();
  if (_.has(lastMessage, filterMaxTag)) {
    const filterMax = parseInt(_.get(lastMessage, filterMaxTag));
    if (keys(lastMessage).length > 1) {
      delete lastMessage[filterMaxTag];
    } else {
      messages.pop();
    }
    if (_.isNumber(filterMax) && confLevel > filterMax) {
      return;
    }
  }

  const { pjsonOptionsTag } = getOptions();
  if (_.has(lastMessage, pjsonOptionsTag)) {
    settings = Object.assign({}, settings, lastMessage[pjsonOptionsTag]);
    if (_.keys(lastMessage).length > 1) {
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
    : level === 7
    ? { silly: subsystem }
    : { log: subsystem };

  // show errors even if depth restriction set
  if (level <= 1) {
    settings.depth = -1;
  }

  let render = pjson.init(settings);

  // load assigned beautifiers to overwrite standard message
  let prettyLine = ['', {}];
  const beautifiers = getConf().beautifiers || [];
  _.each(_.keys(beautifiers), b => {
    _.each(messages, msg => {
      if (_.keys(msg).indexOf(b) !== -1) {
        const pretty = getConf().beautifiers[b](msg[b], render, _);
        if (_.isArray(pretty)) {
          prettyLine[0] += pretty[0];
          _.merge(prettyLine[1], pretty[1]);
        } else {
          prettyLine[0] += pretty;
        }
      }
    });
  });

  if (prettyLine[0]) {
    messages[0] = prettyLine[0];
  }
  messages.push(prettyLine[1]);

  // post process and remove unwanted properties
  if (_.isFunction(getConf().postprocess)) {
    messages = getConf().postprocess(messages, render, _);
  }
  // remove objects tagged with log level higher (more verbose) than current log level
  _.remove(messages, msg =>  msg._log_level > confLevel);
  // remove keys defined in settings
  _.each(messages, msg => _.each(getConf().hideKeys, hkey => delete msg[hkey]));
  // remove empty objects
  _.remove(messages, msg => _.isEmpty(msg));

  log('  ' + render(subObj) + parseMessages(messages, subsystem, render));
  settings.depth = oldDepth;
};

const showColors = () => {
  let render = pjson.init(getOptions());
  _.each(_.keys(getOptions().customColors), (key) => {
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
