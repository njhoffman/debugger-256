const { inspect } = require('util');

let debugTimer;

const debugOut = (screen, messages) => {
  const curr = messages.debug.length > 0 ? messages.debug.shift() : false;
  if (curr) {
    screen.log(curr);
  } else {
    clearInterval(debugTimer);
    debugTimer = 0;
  }
};

// output to blessed log file for debugging
const blessedLog = ({ config, ui, messages }) => ({ type }, msg) => {
  if (config.debug.verbosity < 0) {
    return;
  }

  if (type === 'json') {
    if (config.debug.verbosity >= 2) {
      messages.debug
        .push([`${type}\n`, inspect(msg, { colors: true })]
          .join(' ')
          .split('\n')
          .join(''));
    } else if (config.debug.verbosity === 1) {
      messages.debug.push(`${type} (${Object.keys(msg).length} keys)`);
    }
  } else {
    messages.debug.push([].concat(msg).join('\n\t'));
  }

  // const logger = config.debug.logger || ui.screen.log;
  // const logger = ui.screen.log.bind(ui.screen);

  if (!debugTimer) {
    debugTimer = setInterval(() => (
      debugOut(ui.screen, messages)
    ), config.debug.interval);
  }
};

module.exports = blessedLog;
