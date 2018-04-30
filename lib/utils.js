const _ = require('lodash');
const pjson = require('prettyjson-256');
const { log } = require('./console');

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
    log(` -- Setting ${key} => ${_.isObject(settings[key]) ? '\n' + JSON.stringify(settings[key]) + '\n' : settings[key]}`);
  });
  log('\n');
};

module.exports = { showColors, showSettings };
