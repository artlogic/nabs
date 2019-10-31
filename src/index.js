// nabs - Not another build system. Easy management of package.json scripts.
//
// Copyright (C) 2019 James Kruth
//
// This file is part of nabs.
//
// nabs is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// nabs is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this nabs.  If not, see <http://www.gnu.org/licenses/>.


const fs = require('fs');
const { resolve } = require('path');
const program = require('commander');
const log = require('./logger');
const Task = require('./Task');
const buildTasks = require('./utils/buildTasks');
const checkDependencies = require('./utils/checkDependencies');
const makeArray = require('./utils/makeArray');
const processTasks = require('./utils/process');
const main = require('./main');

const { version } = JSON.parse(fs.readFileSync(resolve('package.json'), 'utf8'));

const nabs = {};

const logLevels = [
  'error',
  'warn',
  'info',
  'debug',
];

nabs.Task = Task;
nabs.makeArray = makeArray;
nabs.buildTasks = buildTasks;
nabs.checkDependencies = checkDependencies;
nabs.process = processTasks;
nabs.main = main;

program
  .version(version)
  .option('-d, --disable', 'disable the default nabs regenerate task')
  .option('-n, --nabs <file>', 'nabs.yml file (defaults to nabs.yml in current dir)')
  .option('-p, --package <file>', 'package.json file (defaults to package.json in current dir)')
  .option('-v, --verbose', 'pass up to 3 times to increase verbosity', (v, total) => total + 1, 0)
  .parse(process.argv);

log.level = logLevels[program.verbose || 0];
log.info('Starting nabs v%s', version);

try {
  nabs.main(program);
} catch (e) {
  log.error(e.message);
  log.debug(e);
  process.exit(1);
}

module.exports = nabs;
