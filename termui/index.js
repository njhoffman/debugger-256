const app = require('./app');

const {
  config, log,
  ui: { screen, inputBar, stripTags },
} = app;

const parseCommand = (text) => {
  const args = text.split(' ');
  const cmd = args[0];
  if (cmd === 'rs' || cmd === 'restart') {
    app.commands.restart();
  } else if (cmd === 'seed' || cmd === 's') {
    app.commands.seed(app, args);
  } else if (cmd === 'clear' || cmd === 'clr') {
    app.commands.clear(app, args);
  } else {
    log(`\t --unknown command: ${text}`);
  }
};

// Quit on  q, or Control-C.
screen.key(['q', 'C-c'], (ch, key) => process.exit(0));

inputBar.on('submit', (text) => {
  parseCommand(stripTags(text).replace(/^>>/, '')
    .trim());
  inputBar.clearValue();
  inputBar.setValue(config.inputPrefix);
  inputBar.focus();
  screen.render();
});

inputBar.key('escape', (ch, key) => {
  inputBar.setValue(config.inputPrefix);
  screen.render();
  inputBar.focus();
});

inputBar.key('backspace', (ch, key) => {
  // key : { sequence: 's', name: 's', ctrl: false, meta: false, shift: false, full: 's' }
  // log(stripTags(inputBar.getValue()).length);
  if (stripTags(inputBar.getValue()).length < 3) {
    inputBar.setValue(config.inputPrefix);
  }
});

inputBar.setValue(config.inputPrefix);
inputBar.focus();
screen.render();
