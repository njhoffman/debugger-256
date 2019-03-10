const _ = require('lodash');
const initUi = require('./ui/init');

module.exports = (app, done) => {
  const ui = { ...initUi(app.config) };
  const {
    screen,
    logBox,
    inputBar,
    totalsWrapper,
    totalsBox,
    diagWrapper,
    diagBox
  } = ui;

  screen.append(logBox);
  screen.append(inputBar);
  screen.append(diagWrapper);
  screen.append(totalsWrapper);

  totalsWrapper.append(totalsBox);
  diagWrapper.append(diagBox);

  done(null, _.merge(app, { ui }));
};
