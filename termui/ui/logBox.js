const blessed = require('blessed');

module.exports = (config) => {
  // create a box perfectly centered horizontally and vertically.
  const logBox = blessed.log({
    top: 0,
    left: 0,
    height: '100%-1',
    mouse: true,
    vi: true,
    scrollOnInput: true,
    scrollable: true,
    alwaysScroll: true,
    // scrollback: 1000,
    // scrollbar: false,
    scrollbar: {
      ch: ' ',
      track: {
        bg: 'cyan'
      },
      style: {
        bg: 'black',
        fg: 'blue'
      }
    },
    style: {
    },
    border: {
      type: 'line',
      fg: 'cyan'
    }
  });

  return { logBox };
};
