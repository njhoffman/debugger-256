const pjson = require('prettyjson-256');
const _ = require('lodash');

const parseMessages = require('./parser');
const {
  getOptions,
  addSubsystem,
  getConf,
  findSubsystemLevel
} = require('./settings');

/* eslint-disable prefer-destructuring, no-param-reassign */

// TODO: on load check configuration file for errors
// TODO: implement '!' to override children subsystems even if specified

const debug = (level, subsystem, ...messages) => {
  let settings = getOptions();
  const oldDepth = settings.depth;
  const lastMessage = _.last(messages);
  let parsedMessage = null;

  let confLevel;
  if (getConf() && _.isObject(getConf().subsystems)) {
    confLevel = findSubsystemLevel(subsystem.split(/[: ]/), getConf().subsystems, 1, 6);
    // if defined as an array, first number is level second number is depth
    if (_.isArray(confLevel)) {
      settings.depth = confLevel.length === 2 ? confLevel[1] : settings.depth;
      confLevel = confLevel[0];
    }
    if (level >= 0 && level > confLevel) {
      return parsedMessage;
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
      return parsedMessage;
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

  const levels = ['fatal', 'error', 'warn', 'log', 'info', 'debug', 'trace', 'silly'];
  const subObj = {};
  subObj[levels[level]] = subsystem;
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
  if (level <= 1) {
    settings.depth = -1;
  }

  const render = pjson.init(settings);

  // load assigned beautifiers to overwrite standard message
  const prettyLine = ['', {}];
  const beautifiers = getConf().beautifiers(messages) || [];
  _.each(_.keys(beautifiers), b => {
    _.each(messages, msg => {
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
    _.remove(messages, msg => msg._log_level > confLevel);
    // remove keys defined in settings
    _.each(messages, msg => _.each(getConf().hideKeys, hkey => delete msg[hkey]));
    // remove empty objects
    _.remove(messages, msg => _.isEmpty(msg));

    settings.depth = oldDepth;
    parsedMessage = `  ${render(subObj)}${parseMessages(messages, subsystem, render)}`;
  }
  return parsedMessage;
};

/* eslint-enable prefer-destructuring, no-param-reassign */

module.exports = {
  debug
};
