'use strict';

const fs = require('fs');
const jsonfile = require('jsonfile');
const yaml = require('js-yaml');

function buildScripts(tasks, prefix) {
  const scripts = {};

  if (typeof tasks === 'string' && prefix) {
    // single action
    scripts[prefix] = tasks;
  } else if (Array.isArray(tasks) && prefix) {
    // list of actions
    scripts[prefix] = tasks.join(' && ');
  } else {
    // get a list of subtasks (filter $ directives)
    const keys = Object.keys(tasks)
          .filter((item) => !item.startsWith('$'))
          .sort();

    // no prefix, no action
    if (prefix) {
      // custom dependencies
      if (Array.isArray(tasks.$depend)) {
        scripts[prefix] = tasks.$depend.map((key) => `npm run ${key}`)
          .join(' && ');
      } else if (typeof tasks.$depend === 'string') {
        scripts[prefix] = `npm run ${tasks.$depend}`;
      } else if (tasks.$depend === null) {
        scripts[prefix] = '';
      } else {
        // make the default action for the task (run children)
        scripts[prefix] = keys.map((key) => `npm run ${prefix}:${key}`)
          .join(' && ');
      }

      // custom action - does the action exist and is it not a zero length array?
      if (tasks.$action && tasks.$action.length !== 0) {
        // append to existing action, if needed
        if (scripts[prefix]) {
          scripts[prefix] += ' && ';
        }

        if (typeof tasks.$action === 'string') {
          scripts[prefix] += tasks.$action;
        } else if (Array.isArray(tasks.$action)) {
          scripts[prefix] += tasks.$action.join(' && ');
        }
      }
    }

    // build the subtasks
    keys.forEach((key) => {
      const taskName = prefix ? `${prefix}:${key}` : key;
      Object.assign(scripts, buildScripts(tasks[key], taskName));
    });
  }

  // don't allow empty script entries - npm doesn't like this
  if (!scripts[prefix]) {
    delete scripts[prefix];
  }

  return scripts;
}

function main() {
  const tasks = yaml.safeLoad(fs.readFileSync('nabs.yml', 'utf8'));
  const pkg = jsonfile.readFileSync('package.json', 'utf8');

  // TODO: change to scripts
  pkg.nabs = buildScripts(tasks);

  jsonfile.writeFileSync('package.json', pkg, {
    encoding: 'utf8',
    spaces: 2,
  });
}

main();
