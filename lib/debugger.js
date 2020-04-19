const pjson = require('prettyjson-256');
const _ = require('lodash');

const { log } = require('./console');
const parseMessages = require('./parser');
const { getOptions, addSubsystem, getConf, resetSettings, initSettings, showColors } = require('./settings');

/* eslint-disable prefer-destructuring, no-param-reassign */

// TODO: on load check configuration file for errors
// TODO: implement '!' to override children subsystems even if specified

const findLevel = (subsystem, conf, depth, level) => {
  const curr = subsystem.slice(0, depth);
  const next = subsystem.length > depth ? subsystem.slice(0, depth + 1) : null;
  if (_.has(conf, curr)) {
    if (_.isNumber(_.get(conf, curr)) || _.isArray(_.get(conf, curr))) {
      return _.get(conf, curr);
    } else if (subsystem.length + 1 > depth && _.has(conf, next)) {
      depth += 1;
      level = findLevel(subsystem, conf, depth, level);
    } else if (_.isNumber(_.get(conf, curr.concat('*'))) || _.isArray(_.get(conf, curr.concat(['*'])))) {
      return _.get(conf, curr.concat('*'));
    }
  }
  return level;
};

const output = (level, subsystem, ...messages) => {
  let settings = getOptions();
  const oldDepth = settings.depth;
  const lastMessage = _.last(messages);
  const levels = ['fatal', 'error', 'warn', 'log', 'info', 'debug', 'trace', 'silly'];
  const levelNumber = _.isNumber(level) ? level : levels.indexOf(level);

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
    if (levelNumber >= 0 && levelNumber > confLevel) {
      return;
    }
  }

  const { filterMaxTag } = getOptions();
  if (_.has(lastMessage, filterMaxTag)) {
    const filterMax = parseInt(_.get(lastMessage, filterMaxTag), 10);
    if (_.keys(lastMessage).length > 1) {
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

  const subObj = {};
  subObj[levels[levelNumber]] = subsystem;
  // levels.forEach((key, i) => {
  //   if (_.has(messages[0], `_${key}`)) {
  //     const msgObj = _.cloneDeep(messages[0][`_${key}`]);
  //     console.info('IM HERE IM HERE');
  //     msgObj._log_level = i;
  //     _.merge(messages[0], msgObj);
  //     delete messages[0][`_${key}`];
  //   }
  // });

  // show errors even if depth restriction set
  if (levelNumber <= 1) {
    settings.depth = -1;
  }

  const render = pjson.init(settings);

  // load assigned beautifiers to overwrite standard message
  const prettyLine = ['', {}];
  const beautifiers = getConf().beautifiers ? getConf().beautifiers(messages) : [];

  _.each(_.keys(beautifiers), (b) => {
    _.each(messages, (msg) => {
      if (_.keys(msg).indexOf(b) !== -1) {
        const pretty = beautifiers[b](msg[b], render, confLevel);
        if (_.isArray(pretty)) {
          // message and serialized object output
          prettyLine[0] += pretty[0];
          _.merge(prettyLine[1], pretty[1]);
        } else {
          prettyLine[0] += pretty;
        }
        delete msg[b];
      }
    });
  });

  if (prettyLine[0]) {
    messages[0] = prettyLine[0];
  }
  messages.push(prettyLine[1]);

  // post process and remove unwanted properties
  if (_.isFunction(getConf().postprocess)) {
    messages = getConf().postprocess(messages, render);
  }

  if (!_.isEmpty(messages)) {
    // remove objects tagged with log level higher (more verbose) than current log level
    _.remove(messages, (msg) => msg._log_level > confLevel);
    // remove keys defined in settings
    _.each(messages, (msg) => _.each(getConf().hideKeys, (hkey) => delete msg[hkey]));
    // remove empty objects
    _.remove(messages, (msg) => _.isEmpty(msg));

    log(`  ${render(subObj)}${parseMessages(messages, subsystem, render)}`);
    settings.depth = oldDepth;
  }
};

const init = (customSettings) => {
  pjson.init(initSettings(customSettings));
};

const reset = () => {
  pjson.init(resetSettings());
};

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
      60: 'fatal',
      50: 'error',
      40: 'warn',
      30: 'info',
      20: 'debug',
      10: 'trace',
      0: 'silly',
    };
    lvl = bunyanLevels[level];
  }

  if (!_logId) {
    _.merge(lineOut, { _logId: _logN });
  }

  if (_.isEmpty(lineOut)) {
    return output(lvl, ssName, msg);
  }
  return output(lvl, ssName, msg, lineOut);
};

/* eslint-enable prefer-destructuring, no-param-reassign */

module.exports = {
  output,
  processLine,
  reset,
  init,
  showColors,
};
