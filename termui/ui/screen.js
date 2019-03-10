const blessed = require('blessed');
const path = require('path');
const appRootPath = require('app-root-path');

module.exports = (config) => {
// create a screen object.
  const screen = blessed.screen({
    smartCSR: true,
    autoPadding: true,
    cursor: {
      shape: 'block',
      blink: true,
      color: '#ff0066'
    },
    log: path.join(`${appRootPath}`, 'blessed.log'),
    // dump: true,
    debug: true,
    fullUnicode: true
  });

  screen.title = 'Message Sender';
  screen.log('screen root node loaded');

  let renderN = 0;
  let lastRender = null;

  screen.on('render', (...args) => {
    // if (!lastRender) {
    //   lastRender = new Date().getTime();
    // }
    // screen.log(`RENDER: ${renderN} ${new Date().getTime() - lastRender}`);
    lastRender = new Date().getTime();
    renderN += 1;
  });

  return { screen };
};
