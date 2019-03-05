const _ = require('lodash');
const { processLine } = require('../lib/main');
const debugLog = require('./debugger');

let logTimer;

const logOut = (ui, messages) => {
  const {
    logBox,
    performanceBox,
    headerBox
  } = ui;

  const curr = messages.log.length > 0
    ? messages.log.shift() : false;

  if (curr) {
    logBox.pushLine(curr);
    messages.history.push(curr);
    performanceBox.updateData(messages);
    headerBox.updateData(messages);
  } else {
    clearInterval(logTimer);
    logTimer = 0;
    _.merge(messages, { endSeed: new Date().getTime() });
  }
};

// output in ui window
let timerN = 0;

const logger = (app) => ({ type, level }, msg) => {
  const { config, clr, ui, messages } = app;
  const { log: { maxEntries } } = config;
  const { history, log, levels } = messages;

  const logTimerTick = () => {
    timerN += 1;
    logOut(ui, messages);
    if (history.length > maxEntries) {
      history.splice(maxEntries - history.length);
    }
  };

  levels[level] += 1;

  if (type === 'send') {
    log.push(` ${clr.orange('SEND')} ${clr.gray(msg.slice(0))}`);
  } else if (type === 'json') {
    const fmtLine = processLine(msg);
    log.push(fmtLine);
    // target.pushLine(processLine(msg));
  } else {
    log.push(clr.gray(msg));
  }

  if (_.isEmpty(logTimer)) {
    if (messages.startSeedTime && !messages.startSeedTimeOut) {
      messages.startSeedTimeOut = new Date().getTime();
    }
    logTimer = setInterval(logTimerTick, config.log.interval);
  }
};


const log = (app) => (type, message) => {
  debugLog(app)({ type, level: message.level }, message);
  logger(app)({ type, level: message.level }, message);

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
  debug: debugLog(app),
  log:   log(app),
  logEx: logException(app)
});

module.exports = (app, done) => (
  done(null, _.merge(app, initLoggers(app)))
);
