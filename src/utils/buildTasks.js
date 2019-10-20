'use strict';

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
