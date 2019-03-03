const blessed = require('blessed');

// Create a screen object.
const screen = blessed.screen({
  smartCSR: true,
  autoPadding: true,
  cursor: {
    shape: 'block',
    blink: true,
    color: '#ff0066'
  },
  log: './blessed.log',
  // dump: true,
  debug: true,
  fullUnicode: true
});
screen.title = 'Message Sender';

process.on('uncaughtException', (err) => {
  screen.log(`${err.name} ${err.message} ${err.stack}`);
  console.error(err);
  setTimeout(() => {
    process.exit(1);
  }, 80000);
});

screen.log('screen root node loaded');

// Create a box perfectly centered horizontally and vertically.
const logBox = blessed.log({
  top: 0,
  left: 0,
  height: '100%-1',
  mouse: true,
  vi: true,
  scrollOnInput: false,
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
  data: null,
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

screen.log('child components initialized');

module.exports = {
  screen,
  logBox,
  inputBar,
  dataBox,
  table1,
  stripTags: blessed.stripTags
};
