const { settings, beautifiers, preprocess, postprocess } = require('./settings');

const subsystems =  {
  'core-api':             { '*' : [5, -1] },
  'better-musician-api':  { '*' : [6, -1] },
  'bmusic-api':           { '*' : [5, -1] },
  'bmusic-client':        { '*' : [5, -1] },
  // if piping to binary must precede with desired environment, i.e. NODE_ENV=test debugger256
  _env:                 {
    test:               {
      'instrumental-api': { '*' : 3 }
    },
    combined:           {
      TapOnIt:          { '*' : [4, -1] },
    }
  }
};

const hideKeys = [
  '_logId',
  '_log_variant',
  '_log_level',
  '_requestUrl',
  '_requestMethod',
  '_requestID',
  '_requestIP',
  '_requestId',
  '_requestIp',
  '_requestLocation',
  '_requestStart',
  '_requestUser',
  '_requestUserID',
  '_requestUserName',
  '_requestUserAgent',
  '_res',
  'hostname',
  'level',
  'message',
  'msg',
  'name',
  'pid',
  'subsystem',
  'time',
  'v'
];

module.exports = {
  subsystems,
  settings,
  hideKeys,
  preprocess,
  postprocess,
  beautifiers
};
