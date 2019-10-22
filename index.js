const fs = require('fs');
const jsonfile = require('jsonfile');
const { resolve } = require('path');
const program = require('commander');
const winston = require('winston');
const yaml = require('js-yaml');

const { version } = JSON.parse(fs.readFileSync(resolve('package.json'), 'utf8'));

const log = winston.createLogger({
  format: winston.format.combine(winston.format.splat(), winston.format.cli()),
  transports: [
    new (winston.transports.Console)({
      handleExceptions: true,
      humanReadableUnhandledException: true,
    }),
  ],
});

const logLevels = [
  'error',
  'warn',
  'info',
  'debug',
];

const nabs = {};

// utility function - string -> [string], [] -> copy of [], null -> []
nabs.makeArray = function makeArray(item) {
  if (typeof item === 'string') {
    return [item];
  }

  if (Array.isArray(item)) {
    return item.slice();
  }

  if (item === null) {
    return [];
  }

  throw new Error(`Item must be string, array or null: ${item}`);
};

nabs.Task = class Task {
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
    this.actions = this.actions.concat(nabs.makeArray(action));
  }

  // expects a child task name (string) and fully qualifies it
  addChild(child) {
    this.children.push(`${this.scriptName}:${child}`);
  }

  // expects a single dependency (string), or a list of dependencies (array)
  // the empty array and null are also allowed
  addDependency(task) {
    const name = this.scriptName;
    const deps = nabs.makeArray(task);

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
};

// given a tasks object (from the YAML file), returns a list of Task objects
nabs.buildTasks = function buildTasks(tasks, name) {
  const task = new nabs.Task(name);
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
        scripts = scripts.concat(nabs.buildTasks(tasks[key], name.concat(key)));
        task.addChild(key);
      });
  }

  return scripts;
};

// look for missing dependencies
nabs.checkDependencies = function checkDependencies(tasks, names) {
  const taskNames = new Set(names);

  tasks.forEach((task) => {
    task.dependencies.forEach((dependency) => {
      if (!taskNames.has(dependency)) {
        throw new Error(`Task ${task} has non-existent dependency: ${dependency}`);
      }
    });
  });
};

// processes tasks, returns scripts
nabs.process = function process(tasks) {
  const scripts = {};
  let taskList = [];

  log.info('Processing tasks...');
  Object.keys(tasks).forEach((task) => {
    taskList = taskList.concat(nabs.buildTasks(tasks[task], [task]));
  });

  log.info('Building scripts...');

  taskList.sort().forEach((item) => {
    scripts[item.scriptName] = item.scriptValue;
  });

  log.info('Checking dependencies...');
  nabs.checkDependencies(taskList, Object.keys(scripts));

  return scripts;
};

nabs.main = function main(options) {
  const nabsFile = options.nabs || resolve('nabs.yml');
  log.info('Opening %s...', nabsFile);
  const tasks = yaml.safeLoad(fs.readFileSync(nabsFile, 'utf8'));

  const pkgFile = options.package || 'package.json';
  log.info('Opening %s...', pkgFile);
  const pkg = jsonfile.readFileSync(pkgFile, 'utf8');

  pkg.scripts = nabs.process(tasks);

  if (!options.disable) {
    pkg.scripts.nabs = 'nabs';
  }

  log.info('Writing %s...', pkgFile);
  jsonfile.writeFileSync('package.json', pkg, {
    encoding: 'utf8',
    spaces: 2,
  });
};

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

export default nabs;
