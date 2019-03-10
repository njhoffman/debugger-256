const screen = require('./screen');
const logBox = require('./logBox');
const totalsBox = require('./totalsBox');
const diagBox = require('./diagBox');
const inputBar = require('./inputBar');

module.exports = (config) => [
  screen,
  logBox,
  totalsBox,
  diagBox,
  inputBar
].map(mod => mod(config));
