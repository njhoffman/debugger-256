const _ = require('lodash');
const { stripTags } = require('blessed');

const initHandlers = ({ ui, config, commands }) => {
  const { screen, inputBar } = ui;
  const { parse, quit } = commands;

  const submitCommand = (text) => {
    parse(stripTags(text)
      .replace(/^\s*>>/, '')
      .trim());
    inputBar.clearValue();
    inputBar.setValue(config.inputPrefix);
    inputBar.focus();
    screen.render();
  };

  const inputEscape = (ch, key) => {
    inputBar.setValue(config.inputPrefix);
    screen.render();
    inputBar.focus();
  };

  const inputBackspace = (ch, key) => {
    // key : { sequence: 's', name: 's', ctrl: false, meta: false, shift: false, full: 's' }
    // log(stripTags(inputBar.getValue()).length);
    if (stripTags(inputBar.getValue()).length < 3) {
      inputBar.setValue(config.inputPrefix);
    }
  };

  screen.key(['q', 'C-c', 'escape'], quit);
  inputBar.on('submit', submitCommand);
  inputBar.key('escape', inputEscape);
  inputBar.key('backspace', inputBackspace);

  inputBar.setValue(config.inputPrefix);
  inputBar.focus();
  screen.render();
  screen.log('ui components initialized');
};

module.exports = (app, done) => (
  done(null, _.merge(app, initHandlers(app)))
);
