const { existsSync } = require('fs');
const { join } = require('path');

module.exports = {
  sync: true,
  friendlyName: 'Get app root dir',
  description: 'Get the application root directory.',
  inputs: {},
  exits: {
    success: {
      outputFriendlyName: 'App root dir',
    },
  },
  fn: function () {
    let currentDir = __dirname;
    while (!existsSync(join(currentDir, 'package.json'))) {
      currentDir = join(currentDir, '..');
    }
    // Send back the result through the success exit.
    return currentDir;
  }
};
