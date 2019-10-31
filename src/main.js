
const fs = require('fs');
const { resolve } = require('path');
const jsonfile = require('jsonfile');
const yaml = require('js-yaml');
const log = require('./logger');
const processTasks = require('./utils/process');

function main(options) {
  const nabsFile = options.nabs || resolve('nabs.yml');
  log.info('Opening %s...', nabsFile);
  const tasks = yaml.safeLoad(fs.readFileSync(nabsFile, 'utf8'));

  const pkgFile = options.package || 'package.json';
  log.info('Opening %s...', pkgFile);
  const pkg = jsonfile.readFileSync(pkgFile, 'utf8');

  pkg.scripts = processTasks(tasks);

  if (!options.disable && !pkg.scripts.nabs) {
    pkg.scripts.nabs = 'nabs';
  }

  log.info('Writing %s...', pkgFile);
  jsonfile.writeFileSync('package.json', pkg, {
    encoding: 'utf8',
    spaces: 2,
  });
}

module.exports = main;
