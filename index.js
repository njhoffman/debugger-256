// enable runtime transpilation to use ES6/7 in node

var fs = require('fs');

var babelrc = fs.readFileSync('.babelrc');
var config;

try {
} catch (err) {
  console.error("==>     ERROR: Parsing your .babelrc");
  console.error(err);
}

require('babel-register')(config);

module.exports = require('./debugger');

