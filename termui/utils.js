const numCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const humanMemorySize = (b, si) => {
  let bytes = Number(b);
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
    u += 1;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return `${bytes.toFixed(1)} ${units[u]}`;
};


const formatByteSize = (bytes) => {
  if (bytes < 1024) return `${bytes} bytes`;
  else if (bytes < 1048576) return `${(bytes / 1024).toFixed(2)} KiB`;
  else if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(2)} MiB`;
  return `${(bytes / 1073741824).toFixed(2)} GiB`;
};

const memorySizeOf = (primaryObj) => {
  let bytes = 0;

  const sizeOf = (obj) => {
    const objClass = Object.prototype.toString.call(obj).slice(8, -1);
    if (obj !== null && obj !== undefined) {
      switch (typeof obj) {
        case 'number':
          bytes += 8;
          break;
        case 'string':
          bytes += obj.length * 2;
          break;
        case 'boolean':
          bytes += 4;
          break;
        case 'object':
          if (objClass === 'Object' || objClass === 'Array') {
            /* eslint-disable no-restricted-syntax, no-prototype-builtins, no-continue */
            for (const key in obj) {
              if (!obj.hasOwnProperty(key)) continue;
              sizeOf(obj[key]);
            }
            /* eslint-enable no-restricted-syntax, no-prototype-builtins, no-continue */
          } else bytes += obj.toString().length * 2;
          break;
        default:
          break;
      }
    }
    return bytes;
  };


  return formatByteSize(sizeOf(primaryObj));
};

const padLeft = (str, len) => (
  len > str.length
    ? (new Array(len - str.length + 1)).join(' ') + str
    : str
);

const padRight = (str, len) => (
  len > str.length
    ? str + (new Array(len - str.length + 1)).join(' ')
    : str
);

module.exports = { numCommas, humanMemorySize, memorySizeOf, padLeft, padRight };
