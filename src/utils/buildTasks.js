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

const Task = require('../Task');

// given a tasks object (from the YAML file), returns a list of Task objects
function buildTasks(tasks, name) {
  const task = new Task(name);
  let scripts = [task];

  if (typeof tasks === 'string' || Array.isArray(tasks)) {
    // simple task
    task.addAction(tasks);
  } else {
    // object task
    if (typeof tasks.$depend !== 'undefined') {
      task.addDependency(tasks.$depend);
    }

    if (typeof tasks.$action !== 'undefined') {
      task.addAction(tasks.$action);
    }

    Object.keys(tasks)
      .filter((item) => !item.startsWith('$'))
      .forEach((key) => {
        scripts = scripts.concat(buildTasks(tasks[key], name.concat(key)));
        task.addChild(key);
      });
  }

  return scripts;
}

module.exports = buildTasks;
