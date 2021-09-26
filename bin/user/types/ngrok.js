const preprocess = require('./ngrok/preprocess');
const postprocess = require('./ngrok/postprocess');
const beautifiers = require('./ngrok/beautifiers');

module.exports = {
  beautifiers,
  preprocess,
  postprocess,
  identifier: ['lvl', 'msg', 't'],
};
