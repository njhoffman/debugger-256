const _ = require('lodash');
const pjson = require('prettyjson-256');
const { log, inspect } = require('./console');

const showColors = (options) => {
  const render = pjson.init(options);
  _.each(_.keys(options.customColors), (key) => {
    const renderObj = {};
    renderObj[key] = `Custom Color: ${key}`;
    log(` -- ${render(renderObj)}`);
  });
  log('\n');
};

const showSettings = (settings) => {
  _.each(_.keys(settings), (key) => {
    log(
      ` -- Setting ${key} => ${
        _.isObject(settings[key]) ? `\n${inspect(settings[key], { colors: true })}\n` : settings[key]
      }`,
    );
  });
  log('\n');
};

const readFile = (loc) => {
  delete require.cache[require.resolve(loc)];
  /* eslint-disable import/no-dynamic-require, global-require */
  return require(loc);
  /* eslint-enable import/no-dynamic-require, global-require */
};

module.exports = { showColors, showSettings, readFile };
