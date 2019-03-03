const async = require('async');
const config = require('./config');
const initUi = require('./ui');
const initCommands = require('./commands');
const initLoggers = require('./logger');
const initHandlers = require('./handlers');

// Quit on  q, or Control-C.
async.waterfall([
  (done) => initUi(config, done),
  initLoggers,
  initCommands,
  initHandlers
], (err, app) => {
  if (err) {
    throw err;
  }
  // console.log(`APP KEYS: ${Object.keys(app)}`);
});
