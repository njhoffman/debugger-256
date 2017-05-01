const pjson = require('prettyjson-256');
const _ = require('lodash');

const parseMessages = require('./parser');
let { options, subsystems } = require('./settings');

const render = pjson.init(options);

const findLevel = (subsystem, conf, depth, level) => {
  const curr = subsystem.slice(0, depth);
  const next = subsystem.length > depth ? subsystem.slice(0, depth + 1) : null;
  if (_.has(conf, curr)) {
    if (typeof _.get(conf, curr) === 'number') {
      return _.get(conf, curr);
    } else if (subsystem.length + 1 > depth && _.has(conf, next)) {
      level = findLevel(subsystem, conf, ++depth, level);
    } else if (typeof _.get(conf, curr.concat('*')) === 'number') {
      return _.get(conf, curr.concat('*'));
    }
  }
  return level;
};

const debug = (level, subsystem, ...messages) => {
  /* TODO: make this overwritten by DEBUG=* environment variable
    nested subsystems delineated by :'s (app:routes:admin)
    set as single number for log level, two numbers comma separated to indicate object logging depth */
  const conf = require('./config.json');

  const confLevel = findLevel(subsystem.split(':'), conf, 1, 6);
  if (level > confLevel) {
    return;
  }
  const subObj = level === 0 ? { fatal: subsystem } : level === 1 ? { error: subsystem } : level === 2 ? { warn: subsystem } : level === 4 ? { info: subsystem } : level === 5 ? { debug: subsystem } : level === 6 ? { trace: subsystem } : { log: subsystem };

  console.log('  ' + render(subObj) + parseMessages(messages, subsystem, render));
};

export const showColors = () => {
  _.each(_.keys(options.customColors), key => {
    console.log(parseMessages([`%Custom Color: ${ key }%`, { color: key }], '', render));
  });
};

export const init = customOptions => {
  options = _.defaultsDeep(options, customOptions);
};

export const createDebug = (subsystem = '') => {
  subsystems.push(subsystem);
  return {
    fatal: debug.bind(undefined, 0, subsystem),
    error: debug.bind(undefined, 1, subsystem),
    warn: debug.bind(undefined, 2, subsystem),
    log: debug.bind(undefined, 3, subsystem),
    info: debug.bind(undefined, 4, subsystem),
    debug: debug.bind(undefined, 5, subsystem),
    trace: debug.bind(undefined, 6, subsystem),
    showColors: showColors,
    init: init
  };
};

module.exports = createDebug;
//# sourceMappingURL=debugger.js.map