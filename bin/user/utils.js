const humanSize = (bytes, si) => {
  bytes = Number(bytes);
  const thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }
  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return `${bytes.toFixed(1)} ${units[u]}`;
};


const padLeft = (input, len) => {
  const str = input.toString() || '';
  return len > str.length
    ? (new Array(len - str.length + 1)).join(' ') + str
    : str;
};

const padRight = (input, len) => {
  const str = input.toString() || '';
  return len > str.length
    ? str + (new Array(len - str.length + 1)).join(' ')
    : str;
};

const padZeros = (num, numZeros) => (Array(numZeros).join('0') + num).slice(-numZeros);
const numCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');


module.exports = {
  humanSize,
  padLeft,
  padRight,
  padZeros,
  numCommas
};
