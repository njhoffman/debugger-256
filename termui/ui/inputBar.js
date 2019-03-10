const blessed = require('blessed');

module.exports = (config) => {
  // textbox -> textarea -> input -> box
  const inputBar = blessed.textbox({
    bottom: 0,
    left: 0,
    height: 1,
    width: '100%',
    tags: true,
    keys: true,
    mouse: true,
    inputOnFocus: true,
    style: {
      fg: '#ffffff',
      bg: '#000022',
      bold: true
    }
  });

  return { inputBar };
};
