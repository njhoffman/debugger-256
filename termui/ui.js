const _ = require('lodash');
const blessed = require('blessed');
const path = require('path');
const appRootPath = require('app-root-path');

const {
  padLeft,
  numCommas: nc,
  humanMemorySize: hms,
  memorySizeOf
} = require('./utils');

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

const headerWrapper = blessed.box({
  top: 'top',
  left: 'center',
  align: 'center',
  width: 'shrink',
  height: 'shrink',
  border: {
    type: 'line',
    // fg: '#660033'
    fg: 'cyan'
  }
});

const headerBox = blessed.table({
  top: 'top',
  left: 'left',
  align: 'center',
  tags: true,
  pad: 5,
  width: 'shrink',
  height: 'shrink',
  border: 'bg', // line
  noCellBorders: true,
  data: [],
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

headerBox.updateData = ({ log = [], history = [], levels = {} }) => {
  headerBox.setData([[
    'Total',
    'Queued',
    'History',
    'Errors'
  ], [
    `${nc(Math.max(log.length + history.length - 1, 0))}`,
    `${nc(log.length)}`,
    `${nc(Math.max(history.length - 1, 0))}`,
    `${nc((levels[10] + levels[20]) || 0)}`
  ]]);
};

headerBox.updateData({});

const performanceWrapper = blessed.box({
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

const performanceBox = blessed.table({
  top: 0,
  left: 0,
  // left: 'center',
  // bold, cyan-fg
  align: 'left',
  tags: true,
  height: 1,
  border: 'bg', // line
  width: 'shrink',
  pad: 2,
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

performanceBox.updateData = ({ history = [], startSeedTime, startSeedN }) => {
  const {
    heapUsed,
    heapTotal,
    rss
  } = process.memoryUsage();

  const duration = startSeedTime
    ? `${((new Date().getTime() - startSeedTime) / 1000).toFixed(2)}`
    : 0;

  const speed = startSeedN && duration
    ? `${((history.length - startSeedN) / duration).toFixed(2)} ln/s`
    : 'n/a';

  performanceBox.setData([
    [padLeft('History Size', 16), `${memorySizeOf(history)}`],
    [padLeft('Render Duration', 16), `${duration} s`],
    [padLeft('Render Speed', 16), `${speed}`],
    [padLeft('Heap Usage', 16), hms(heapUsed)],
    [padLeft('Heap Total', 16), hms(heapTotal)],
    [padLeft('RSS Total', 16), hms(rss)],
  ]);
};

// performanceBox.setContent('');
// performanceBox.updateData({});

screen.append(logBox);
screen.append(inputBar);
screen.append(performanceWrapper);
screen.append(headerWrapper);
headerWrapper.append(headerBox);
performanceWrapper.append(performanceBox);

const ui = {
  screen,
  logBox,
  inputBar,
  headerBox,
  performanceBox
};

module.exports = (app, done) => (
  done(null, _.merge(app, { ui }))
);
