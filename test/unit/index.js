// to fix mochista not globbing directory
require('fs')
  .readdirSync(__dirname)
  .forEach((file) => {
    if (file !== 'index.js') {
      require(`./${file}`);
    }
  });
