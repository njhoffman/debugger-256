const _ = require('lodash');
const faker = require('faker');

const generateLog = ({ name, subsystem, msg, level }, extra) => ({
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

const generateLogs = (app, num = 100, itemRange = [3, 24]) => {
  // const categories = [
  //   'address', 'commerce', 'company', 'database', 'date', 'finance', 'hacker',
  //   'helpers', 'internet', 'lorem', 'name', 'phone', 'random', 'system'
  // ];

  const names = _.times(_.random(3, 8), faker.hacker.noun);
  const subsystems = _.times(_.random(4, 20), faker.hacker.noun);
  const levels = [10, 20, 30, 40, 50, 60];
  // const levels = ['fatal', 'error', 'warn', 'log', 'info', 'debug', 'trace', 'silly'];

  const extra = _.times(
    _.random(...itemRange),
    faker[randomSelect(_.keys(faker.name))]
  );

  _.times(100, (n) => {
    const logItem = generateLog({
      name: randomSelect(names),
      subsystem: randomSelect(subsystems),
      level: randomSelect(levels),
      msg: `#${n} ${_.times(_.random(5, 20), faker.lorem.words)}`,
      ...extra
    });
    app.log('json', logItem);
  });
};

const seed = (app, args) => {
  const num = args[1];
  app.log('seed', `=> ${app.clr.white('seeding')}`);
  generateLogs(app, num);
};

const restart = () => process.exit();

const clear = (app) => app.ui.logBox.clearBaseLine(20);

module.exports = { seed, restart, clear };
