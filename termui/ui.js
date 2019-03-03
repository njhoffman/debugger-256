const _ = require('lodash');
const blessed = require('blessed');
const path = require('path');
const appRootPath = require('app-root-path');

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
  if (!lastRender) {
    lastRender = new Date().getTime();
  }
  screen.log(`RENDER: ${renderN} ${new Date().getTime() - lastRender}`);
  lastRender = new Date().getTime();
  renderN += 1;
});

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

const dataBox = blessed.box({
  top: 0,
  right: 0,
  width: 'shrink',
  height: 'shrink',
  // shadow: true,
  content: '',
  border: {
    type: 'line',
    // fg: '#660033'
    fg: 'cyan'
  }
});

const table1 = blessed.table({
  top: 0,
  left: 0,
  // left: 'center',
  data: [
    ['Animals', 'Foods'],
    ['Elephant', 'Apple']
  ],
  align: 'center',
  tags: true,
  height: 1,
  border: 'bg', // line
  width: 'shrink',
  pad: 1,
  noCellBorders: true,
  style: {
    border: {
      fg: 'red'
    },
    header: {
      fg: 'cyan',
      bold: true
    },
    cell: {
      fg: 'blue',
      bold: true
    }
  }
});

screen.append(logBox);
screen.append(inputBar);
screen.append(dataBox);
dataBox.append(table1);

const ui = {
  screen,
  logBox,
  inputBar,
  dataBox,
  table1
};

module.exports = (app, done) => (
  done(null, _.merge(app, { ui }))
);
