const seed = (app, args) => {
  const num = args[1];
  app.log('seed', `=> ${app.clr.white('POOP')} ${num}`);
};

const restart = () => process.exit();

module.exports = { seed, restart };
