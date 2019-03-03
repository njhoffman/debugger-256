const _ = require('lodash');
const faker = require('faker');

const generateLogItem = ({ name, subsystem, msg, level }, extra) => ({
  name,
  subsystem,
  msg,
  level,
  hostname: 'orpheus',
  pid: 12345,
  time: new Date().toISOString(),
  v: 0,
  ...extra
});

const randomSelect = (collection) => (
  collection[_.random(0, collection.length - 1)]
);

const seed = (app) => (numItems = 100, itemRange = [3, 24]) => {
  // const categories = [
  //   'address', 'commerce', 'company', 'database', 'date', 'finance', 'hacker',
  //   'helpers', 'internet', 'lorem', 'name', 'phone', 'random', 'system'
  // ];

  app.log('seed', `generating ${numItems} seeds`);
  const names = _.times(_.random(3, 8), faker.hacker.noun);
  const subsystems = _.times(_.random(4, 20), faker.hacker.noun);
  const levels = [10, 20, 30, 40, 50, 60];
  // const levels = ['fatal', 'error', 'warn', 'log', 'info', 'debug', 'trace', 'silly'];

  const extra = _.times(
    _.random(...itemRange),
    faker[randomSelect(_.keys(faker.name))]
  );

  _.times(numItems, (n) => {
    const logItem = generateLogItem({
      name: randomSelect(names),
      subsystem: randomSelect(subsystems),
      level: randomSelect(levels),
      msg: `#${n} ${_.times(_.random(5, 20), faker.lorem.word).join(' ')}`,
      ...extra
    });
    app.log('json', logItem);
  });
};

const restart = (app) => (args) => process.exit();

const quit = (app) => (args) => process.exit();

const clear = ({ ui }) => (args) => ui.logBox.clearBaseLine(20);

const unknown = ({ debug }) => (cmd) => debug(`  --unknown command: ${cmd}`);

const commands = (app) => ({
  seed:    seed(app),
  quit:    quit(app),
  restart: restart(app),
  clear:   clear(app),
  unknown: unknown(app)
});

const parse = (cmds) => (text) => {
  const [cmd, ...args] = text.split(' ');
  if (cmd === 'rs' || cmd === 'restart') {
    cmds.restart();
  } else if (cmd === 'quit' || cmd === 'q') {
    cmds.quit();
  } else if (cmd === 'seed' || cmd === 's') {
    cmds.seed(args);
  } else if (cmd === 'clear' || cmd === 'clr') {
    cmds.clear(args);
  } else {
    cmds.unknown(args);
  }
};

const initCommands = (app) => {
  const cmds = commands(app);
  return {
    ...cmds,
    parse: parse(cmds)
  };
};

module.exports = (app, done) => (
  done(null, _.merge(app, {
    commands: initCommands(app)
  }))
);
