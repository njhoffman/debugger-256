// to fix mochista not globbing directory
const debuggerTests = require('./debugger.spec');
const parserTests = require('./parser.spec');
const settingsTests = require('./settings.spec');
const utilsTests = require('./utils.spec');
const consoleTests = require('./console.spec');

module.exports = () => {
  debuggerTests();
  parserTests();
  settingsTests();
  utilsTests();
  consoleTests();
};
