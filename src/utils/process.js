
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
