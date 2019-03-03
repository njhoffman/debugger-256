const app = require('./config');
app.ui = require('./ui');
app.util = require('./utils');
app.commands = require('./commands');

app.log = (...msg) => {
  app.ui.screen.log(msg.join(' '));
  app.util.logger(app.ui.logBox, msg);
  app.ui.screen.render();
};

module.exports = app;
