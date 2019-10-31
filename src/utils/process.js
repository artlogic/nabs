
const buildTasks = require('./buildTasks').default;
const checkDependencies = require('./checkDependencies').default;
const log = require('../logger').default;

// processes tasks, returns scripts
function process(tasks) {
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

export default process;
