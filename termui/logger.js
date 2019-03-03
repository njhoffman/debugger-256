const _ = require('lodash');
const { inspect } = require('util');
const { processLine } = require('../lib/main');

let debugTimer;
let logTimer;

const debugOut = (screen, messages) => {
  const curr = messages.debug.length > 0 ? messages.debug.shift() : false;
  if (curr) {
    screen.log(curr);
    messages.history.push(curr);
  } else {
    clearInterval(debugTimer);
    debugTimer = 0;
  }
};

// output to blessed log file for debugging
const debug = ({ config, ui, messages }) => (type, msg) => {
  const { debugLog }  = config;
  if (type === 'json') {
    if (debugLog.verbosity >= 2) {
      messages.debug.push([
        `${type}\n`,
        inspect(msg, { colors: true })
      ].join(' ')
        .split('\n')
        .join(''));
    } else if (debugLog.verbosity === 1) {
      messages.debug.push(`${type} (${Object.keys(msg).length} keys)`);
    }
  } else {
    messages.debug.push([].concat(msg).join('\n\t'));
  }

  if (!debugTimer) {
    debugTimer = setInterval(() => (
      debugOut(ui.screen, messages)
    ), debugLog.interval);
  }
};

const logOut = (logBox, messages) => {
  const curr = messages.log.length > 0 ? messages.log.shift() : false;
  if (curr) {
    logBox.pushLine(curr);
    messages.history.push(curr);
  } else {
    clearInterval(logTimer);
    logTimer = 0;
  }
};

// output in ui window
const logger = (app) => (type, msg) => {
  // console.log("TYPE", type, msg);
  const { config, clr, ui, messages } = app;
  if (type === 'send') {
    messages.log.push(` ${clr.orange('SEND')} ${clr.gray(msg.slice(0))}`);
  } else if (type === 'json') {
    const fmtLine = processLine(msg);
    // console.log(JSON.stringify(fmtLine));
    messages.log.push(fmtLine);
    // target.pushLine(processLine(msg));
  } else {
    messages.log.push(clr.gray(msg));
  }

  if (!logTimer) {
    logTimer = setInterval(() => (
      logOut(ui.logBox, messages)
    ), config.log.interval);
  }
};


const log = (app) => (type, msg) => {
  debug(app)(type, msg);
  logger(app)(type, msg);

  app.ui.screen.render();
};

const logException = ({ ui }) => (err) => {
  const errorMsg = `\n-------\n${err.name} ${err.message} ${err.stack}\n-------\n`;
  ui.screen.log(errorMsg);
  ui.logBox.pushLine(errorMsg);
  setTimeout(() => {
    process.exit(1);
  }, 80000);
};

const initLoggers = (app) => ({
  debug: debug(app),
  log:   log(app),
  logEx: logException(app)
});

module.exports = (app, done) => (
  done(null, _.merge(app, initLoggers(app)))
);
