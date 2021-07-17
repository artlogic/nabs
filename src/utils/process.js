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

const buildTasks = require('./buildTasks');
const checkDependencies = require('./checkDependencies');
const log = require('../logger');

// processes tasks, returns scripts
function processTasks(tasks) {
  const scripts = {};
  let taskList = [];

  log.info('Processing tasks...');
  Object.keys(tasks).forEach((task) => {
    taskList = taskList.concat(buildTasks(tasks[task], [task]));
  });

  log.info('Building scripts...');
  taskList.sort().forEach((item) => {
    scripts[item.scriptName] = item.scriptValue;
  });

  log.info('Checking dependencies...');
  checkDependencies(taskList, Object.keys(scripts));

  return scripts;
}

module.exports = processTasks;
