const colors = require('ansi-256-colors');

const config = {
  inputPrefix: '{#cc0033-fg}{bold}>>{/} ',
  log: {
    file: '',
    interval: 0,
    maxEntries: 2000,
    scrollbar: true,
    scrollEntries: 5000,
    panelTotals: true,
    panelDiag: true,
    panelSettings: true,
    panelFilters: true,
    panelHelp: true
  },
  debug: {
    verbosity: -1,
    interval: 20,
    showMessages: true,
    showRenders: true
  },
};

const clr = {
  lightBlue: (msg) => colors.fg.getRgb(0, 2, 4) + msg + colors.reset,
  blue: (msg) => colors.fg.getRgb(1, 2, 5) + msg + colors.reset,
  red: (msg) => colors.fg.getRgb(4, 0, 0) + msg + colors.reset,
  green: (msg) => colors.fg.getRgb(0, 4, 2) + msg + colors.reset,
  orange: (msg) => colors.fg.getRgb(4, 1, 0) + msg + colors.reset,
  gray: (msg) => colors.fg.grayscale[16] + msg + colors.reset,
  white: (msg) => colors.fg.grayscale[23] + msg + colors.reset
};

const messages = {
  debug: [],
  log: [],
  history: [],
  subsystems: {},
  levels: {
    10: 0, 20: 0, 30: 0, 40: 0, 50: 0, 60: 0
  }
};

// config.debug.logger = (...msg) => {
//   console.log(`DEBUG LOGGER ${typeof msg}`, msg);
// };

module.exports = { clr, config, messages };
