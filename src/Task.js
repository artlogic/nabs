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

const makeArray = require('./utils/makeArray');

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

module.exports = Task;
