const chalk = require('chalk');
const depcheck = require('depcheck');
const appRoot = require('app-root-path');

const pkgJson = require(`${appRoot}/package.json`);

const verbosity = 1; // 0, 1, or 2 (most verbose)

const depCount = {
  prod: Object.keys(pkgJson.dependencies).length,
  dev: Object.keys(pkgJson.devDependencies).length
};

const options = {
  ignoreBinPackage: false, // ignore the packages with bin entry
  skipMissing: false, // skip calculation of missing dependencies
  ignoreDirs: [ // folder with these names will be ignored
    'reports',
    'node_modules',
    'bower_components'
  ],
  ignoreMatches: [
    '@commitlint',
    'es6-plato',
    'request',
    'husky',
    'eslint-*',
    'grunt-*',
    'lib',
    'test', // TODO: fix babelrc module loader plugin bug
    'git-stats-importer' // api/bin/git/init-gitstats
  ],
  detectors: [ // the target detectors
    depcheck.detector.requireCallExpression,
    depcheck.detector.importDeclaration
  ],
};

console.log([
  `\nRunning a dependency check on ${chalk.bold(appRoot)} for`,
  `${chalk.cyan(depCount.prod)} production deps and`,
  `${chalk.cyan(depCount.dev)} development deps for a sum of`,
  `${chalk.cyan(depCount.dev + depCount.prod)} total dependencies.`,
].join('\n  '));

const startTime = new Date().getTime();

depcheck(`${appRoot}`, options, ({
  dependencies,
  devDependencies,
  missing,
  using,
  invalidFiles,
  invalidDirs
}) => {
  const counts = {
    unused: {
      prod: dependencies.length,
      dev: devDependencies.length
    },
    missing: Object.keys(missing).length,
    using: Object.keys(using).length,
    badFiles: Object.keys(invalidFiles).length,
    badDirs: Object.keys(invalidDirs).length
  };

  const elapsed = `${parseFloat((new Date().getTime() - startTime) / 1000)}s`;

  console.log([
    `\nFinished in ${elapsed} with ${chalk.yellow(counts.unused.prod)} ${chalk.bold('prod')} dependencies unused`,
    `and ${chalk.yellow(counts.unused.dev)} ${chalk.bold('dev')} dependencies unused.`
  ].join(' '));

  if (verbosity > 0) {
    if (dependencies.length > 0) {
      console.log('\nUnused production dependencies:');
      dependencies.forEach(dep => console.log(`\t${dep}`));
    }
    if (devDependencies.length > 0) {
      console.log('\nUnused development dependencies:');
      devDependencies.forEach(dep => console.log(`\t${dep}`));
    }
  }

  if (counts.missing > 0) {
    console.log(`\nMissing ${chalk.yellow(counts.missing)} dependencies not listed in package.json.`);
    if (verbosity > 0) {
      console.log('\nDependencies missing in package.json:');
      Object.keys(missing).forEach(name => {
        console.log(`  ${chalk.yellow(name)} : ${missing[name].length} locations`);
        missing[name].forEach(location => console.log(`    ${location}`));
      });
    }
  }

  if (counts.using > 0) {
    console.log(`\nFound ${chalk.bold(counts.using)} dependencies used in ${chalk.bold(5000)} locations.`);
    if (verbosity > 1) {
      console.log('\nDiscovered dependencies: ');
      Object.keys(using).forEach(name => {
        console.log(`  ${name} : ${using[name].length} locations`);
        using[name].forEach(location => console.log(`    ${location}`));
      });
    }
  }

  if (counts.badFiles > 0) {
    console.log(`\nProblem reading ${chalk.red(counts.badFiles)} files: `);
    Object.keys(invalidFiles).forEach(name => {
      console.log(`-- ${chalk.red(name)} -- `);
      console.log(invalidFiles[name]);
    });
  }

  if (counts.badDirs > 0) {
    console.log(`\nProblem reading ${chalk.red(counts.badDirs)} directories: `);
    Object.keys(invalidDirs).forEach(name => {
      console.log(`-- ${chalk.red(name)} -- `);
      console.log(invalidDirs[name]);
    });
  }
});
