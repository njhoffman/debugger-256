const beautifiers = require('./bunyan/beautifiers');
const postprocess = require('./bunyan/postprocess');

module.exports = {
  beautifiers,
  postprocess,
  identifier: ['hostname', 'name', 'pid', 'time', 'v']
};
