#!/usr/bin/env node --harmony

// nabs - Not another build system. Easy management of package.json scripts.
//
// Copyright (C) 2016 James Kruth
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

'use strict';

const fs = require('fs');
const jsonfile = require('jsonfile');
const path = require('path');
const program = require('commander');
const winston = require('winston');
const yaml = require('js-yaml');

const levels = [
  'error',
  'warn',
  'info',
  'debug',
];

// utility function - string -> [string], [] -> [], null -> []
function makeArray(item) {
  if (typeof item === 'string') {
    return [item];
  } else if (Array.isArray(item)) {
    return item;
  } else if (item === null) {
    return [];
  }

  throw new Error(`Item must be string, array or null: ${item}`);
}

class Task {
  constructor(name) {
    // name is an array of the full parts of the name
    // e.g. ['super', 'task', 'sub']
    this.name = name;

    // an array of action strings (shell commands)
    this.actions = [];
    // an array of task names: ['task:sub1', 'task:sub2', 'task:sub3']
    this.dependencies = [];

    // children are needed to calculate the default dependencies
    // an array of task names: ['task:sub1', 'task:sub2', 'task:sub3']
    this.children = [];
    // default to using the children as dependencies
    this.useChildrenAsDependencies = true;
  }

  // expects a single action (string), or a list of actions (array)
  addAction(action) {
    this.actions = this.actions.concat(makeArray(action));
  }

  // expects a child task name (string) and fully qualifies it
  addChild(child) {
    this.children.push(`${this.scriptName}:${child}`);
  }

  // expects a single dependency (string), or a list of dependencies (array)
  // the empty array and null are also allowed
  addDependency(task) {
    const name = this.scriptName;
    const deps = makeArray(task);

    // dependencies have been overridden
    this.useChildrenAsDependencies = false;

    // change shorthand deps (:subtask) to full (task:subtask)
    deps.forEach((item, index) => {
      if (item.startsWith(':')) {
        deps[index] = name + item;
      }
    });

    this.dependencies = this.dependencies.concat(deps);
  }

  get scriptName() {
    return this.name.join(':');
  }

  get scriptValue() {
    let rawActions = [];

    function npmify(arr) {
      return arr.map((key) => `npm run ${key}`);
    }

    // generate dependencies
    if (this.useChildrenAsDependencies) {
      rawActions = npmify(this.children.sort());
    } else {
      rawActions = npmify(this.dependencies);
    }

    // concat actions
    rawActions = rawActions.concat(this.actions);

    if (rawActions.length === 0) {
      throw new Error(`Tasks with no actions or dependencies are invalid: ${this}`);
    }

    return rawActions.join(' && ');
  }

  toString() {
    return this.scriptName;
  }
}

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

function checkDependencies(tasks, names) {
  const taskNames = new Set(names);

  tasks.forEach((task) => {
    task.dependencies.forEach((dependency) => {
      if (!taskNames.has(dependency)) {
        throw new Error(`Task ${task} has non-existent dependency: ${dependency}`);
      }
    });
  });
}

function main(options) {
  const tasks = yaml.safeLoad(fs.readFileSync(options.nabs || 'nabs.yml', 'utf8'));
  const pkg = jsonfile.readFileSync(options.package || 'package.json', 'utf8');
  const scripts = pkg.nabs = {};
  let taskList = [];

  Object.keys(tasks).forEach((task) => {
    taskList = taskList.concat(buildTasks(tasks[task], [task]));
  });

  taskList.sort().forEach((item) => {
    scripts[item.scriptName] = item.scriptValue;
  });

  // verify dependencies
  checkDependencies(taskList, Object.keys(scripts));

  jsonfile.writeFileSync('package.json', pkg, {
    encoding: 'utf8',
    spaces: 2,
  });
}

program
  .version(JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8')).version)
  .option('-n, --nabs <file>', 'nabs.yml file (defaults to nabs.yml in current dir)')
  .option('-p, --package <file>', 'package.json file (defaults to package.json in current dir)')
  .option('-v, --verbose', 'pass up to 3 times to increase verbosity', (v, total) => total + 1, 0)
  .parse(process.argv);

const log = new winston.Logger({
  level: levels[program.verbose || 0],
  transports: [
    new (winston.transports.Console)({
      handleExceptions: true,
      humanReadableUnhandledException: true,
    }),
  ],
});
log.cli();

if (!module.parent) {
  // we've been run directly
  main(program);
} else {
  // we've been imported - just expose the machinery
  module.exports = {
    makeArray,
    Task,
    buildTasks,
    checkDependencies,
    main,
  };
}
