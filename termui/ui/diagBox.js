const blessed = require('blessed');
const {
  padLeft,
  humanMemorySize: hms,
  memorySizeOf
} = require('./utils');

module.exports = (config) => {
  const diagWrapper = blessed.box({
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

  const diagBox = blessed.table({
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

  diagBox.updateData = ({ history = [], startSeedTime, startSeedN }) => {
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

    diagBox.setData([
      [padLeft('History Size', 16), `${memorySizeOf(history)}`],
      [padLeft('Render Duration', 16), `${duration} s`],
      [padLeft('Render Speed', 16), `${speed}`],
      [padLeft('Heap Usage', 16), hms(heapUsed)],
      [padLeft('Heap Total', 16), hms(heapTotal)],
      [padLeft('RSS Total', 16), hms(rss)],
    ]);
  };

  return {
    diagWrapper,
    diagBox
  };
};
