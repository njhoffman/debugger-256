const blessed = require('blessed');
const { numCommas: nc, } = require('./utils');

module.exports = (config) => {
  const totalsWrapper = blessed.box({
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

  const totalsBox = blessed.table({
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

  totalsBox.updateData = ({ log = [], history = [], levels = {} }) => {
    totalsBox.setData([[
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
  totalsBox.updateData({});

  return {
    totalsWrapper,
    totalsBox
  };
};
