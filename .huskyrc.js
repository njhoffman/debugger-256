const path = require('path');
const fs = require('fs');
const os = require('os');

const tasks = arr => arr.join(' && ');

let hostHooks = {};
const hostFile = path.resolve(
  `./config/hosts/${os.hostname()}/.huskyrc.js`
);

if (fs.existsSync(hostFile)) {
  hostHooks = require(hostFile);
}
// TODO: fork notes to prevent error exit status
const baseHooks = {
  'pre-commit': 'npm run lint',
  'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
  'post-commit': tasks([
    'npm run reports:notes',
    // 'npm run test:coverage',
    'npm run reports:depcheck'
  ]),
  'pre-push': './.bin/prePushVersion.sh',
  'post-push': tasks([
    'git push --no-verify',
    'git push --tags --no-verify'
    './.bin/postPushVersion.sh',
    'npm run reports:depcheck',
    'npm outdated'
  ])
};

module.exports = { hooks: { ...baseHooks, ...hostHooks } };

