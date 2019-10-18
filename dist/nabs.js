#!/usr/bin/env node
(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function(module) {\n\tif (!module.webpackPolyfill) {\n\t\tmodule.deprecate = function() {};\n\t\tmodule.paths = [];\n\t\t// module.parent = undefined by default\n\t\tif (!module.children) module.children = [];\n\t\tObject.defineProperty(module, \"loaded\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.l;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"id\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.i;\n\t\t\t}\n\t\t});\n\t\tmodule.webpackPolyfill = 1;\n\t}\n\treturn module;\n};\n\n\n//# sourceURL=webpack:///(webpack)/buildin/module.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(module) {// nabs - Not another build system. Easy management of package.json scripts.\n//\n// Copyright (C) 2016 James Kruth\n//\n// This file is part of nabs.\n//\n// nabs is free software: you can redistribute it and/or modify\n// it under the terms of the GNU General Public License as published by\n// the Free Software Foundation, either version 3 of the License, or\n// (at your option) any later version.\n//\n// nabs is distributed in the hope that it will be useful,\n// but WITHOUT ANY WARRANTY; without even the implied warranty of\n// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n// GNU General Public License for more details.\n//\n// You should have received a copy of the GNU General Public License\n// along with this nabs.  If not, see <http://www.gnu.org/licenses/>.\n\n\nconst fs = __webpack_require__(/*! fs */ \"fs\");\n\nconst jsonfile = __webpack_require__(/*! jsonfile */ \"jsonfile\");\n\nconst {\n  resolve\n} = __webpack_require__(/*! path */ \"path\");\n\nconst program = __webpack_require__(/*! commander */ \"commander\");\n\nconst winston = __webpack_require__(/*! winston */ \"winston\");\n\nconst yaml = __webpack_require__(/*! js-yaml */ \"js-yaml\");\n\nconst {\n  version\n} = JSON.parse(fs.readFileSync(resolve('package.json'), 'utf8'));\nconst log = winston.createLogger({\n  format: winston.format.combine(winston.format.splat(), winston.format.cli()),\n  transports: [new winston.transports.Console({\n    handleExceptions: true,\n    humanReadableUnhandledException: true\n  })]\n});\nconst logLevels = ['error', 'warn', 'info', 'debug'];\nconst nabs = {}; // utility function - string -> [string], [] -> copy of [], null -> []\n\nnabs.makeArray = function makeArray(item) {\n  if (typeof item === 'string') {\n    return [item];\n  }\n\n  if (Array.isArray(item)) {\n    return item.slice();\n  }\n\n  if (item === null) {\n    return [];\n  }\n\n  throw new Error(`Item must be string, array or null: ${item}`);\n};\n\nnabs.Task = class Task {\n  constructor(name) {\n    // name is an array of the full parts of the name\n    // e.g. ['super', 'task', 'sub']\n    this.name = name; // an array of action strings (shell commands)\n\n    this.actions = []; // an array of task names: ['task:sub1', 'task:sub2', 'task:sub3']\n\n    this.dependencies = []; // children are needed to calculate the default dependencies\n    // an array of task names: ['task:sub1', 'task:sub2', 'task:sub3']\n\n    this.children = []; // default to using the children as dependencies\n\n    this.useChildrenAsDependencies = true;\n  } // expects a single action (string), or a list of actions (array)\n\n\n  addAction(action) {\n    this.actions = this.actions.concat(nabs.makeArray(action));\n  } // expects a child task name (string) and fully qualifies it\n\n\n  addChild(child) {\n    this.children.push(`${this.scriptName}:${child}`);\n  } // expects a single dependency (string), or a list of dependencies (array)\n  // the empty array and null are also allowed\n\n\n  addDependency(task) {\n    const name = this.scriptName;\n    const deps = nabs.makeArray(task); // dependencies have been overridden\n\n    this.useChildrenAsDependencies = false; // change shorthand deps (:subtask) to full (task:subtask)\n\n    deps.forEach((item, index) => {\n      if (item.startsWith(':')) {\n        deps[index] = name + item;\n      }\n    });\n    this.dependencies = this.dependencies.concat(deps);\n  }\n\n  get scriptName() {\n    return this.name.join(':');\n  }\n\n  get scriptValue() {\n    let rawActions = [];\n\n    function npmify(arr) {\n      return arr.map(key => `npm run ${key}`);\n    } // generate dependencies\n\n\n    if (this.useChildrenAsDependencies) {\n      rawActions = npmify(this.children.sort());\n    } else {\n      rawActions = npmify(this.dependencies);\n    } // concat actions\n\n\n    rawActions = rawActions.concat(this.actions);\n\n    if (rawActions.length === 0) {\n      throw new Error(`Tasks with no actions or dependencies are invalid: ${this}`);\n    }\n\n    return rawActions.join(' && ');\n  }\n\n  toString() {\n    return this.scriptName;\n  }\n\n}; // given a tasks object (from the YAML file), returns a list of Task objects\n\nnabs.buildTasks = function buildTasks(tasks, name) {\n  const task = new nabs.Task(name);\n  let scripts = [task];\n\n  if (typeof tasks === 'string' || Array.isArray(tasks)) {\n    // simple task\n    task.addAction(tasks);\n  } else {\n    // object task\n    if (typeof tasks.$depend !== 'undefined') {\n      task.addDependency(tasks.$depend);\n    }\n\n    if (typeof tasks.$action !== 'undefined') {\n      task.addAction(tasks.$action);\n    }\n\n    Object.keys(tasks).filter(item => !item.startsWith('$')).forEach(key => {\n      scripts = scripts.concat(nabs.buildTasks(tasks[key], name.concat(key)));\n      task.addChild(key);\n    });\n  }\n\n  return scripts;\n}; // look for missing dependencies\n\n\nnabs.checkDependencies = function checkDependencies(tasks, names) {\n  const taskNames = new Set(names);\n  tasks.forEach(task => {\n    task.dependencies.forEach(dependency => {\n      if (!taskNames.has(dependency)) {\n        throw new Error(`Task ${task} has non-existent dependency: ${dependency}`);\n      }\n    });\n  });\n}; // processes tasks, returns scripts\n\n\nnabs.process = function process(tasks) {\n  const scripts = {};\n  let taskList = [];\n  log.info('Processing tasks...');\n  Object.keys(tasks).forEach(task => {\n    taskList = taskList.concat(nabs.buildTasks(tasks[task], [task]));\n  });\n  log.info('Building scripts...');\n  taskList.sort().forEach(item => {\n    scripts[item.scriptName] = item.scriptValue;\n  });\n  log.info('Checking dependencies...');\n  nabs.checkDependencies(taskList, Object.keys(scripts));\n  return scripts;\n};\n\nnabs.main = function main(options) {\n  const nabsFile = options.nabs || resolve('src/nabs.yml');\n  log.info('Opening %s...', nabsFile);\n  const tasks = yaml.safeLoad(fs.readFileSync(nabsFile, 'utf8'));\n  const pkgFile = options.package || 'package.json';\n  log.info('Opening %s...', pkgFile);\n  const pkg = jsonfile.readFileSync(pkgFile, 'utf8');\n  pkg.scripts = nabs.process(tasks);\n\n  if (!options.disable) {\n    pkg.scripts.nabs = 'nabs';\n  }\n\n  log.info('Writing %s...', pkgFile);\n  jsonfile.writeFileSync('package.json', pkg, {\n    encoding: 'utf8',\n    spaces: 2\n  });\n};\n\nprogram.version(version).option('-d, --disable', 'disable the default nabs regenerate task').option('-n, --nabs <file>', 'nabs.yml file (defaults to nabs.yml in current dir)').option('-p, --package <file>', 'package.json file (defaults to package.json in current dir)').option('-v, --verbose', 'pass up to 3 times to increase verbosity', (v, total) => total + 1, 0).parse(process.argv);\nlog.level = logLevels[program.verbose || 0];\n\nif (!module.parent) {\n  // we've been run directly\n  log.info('Starting nabs v%s', version);\n\n  try {\n    nabs.main(program);\n  } catch (e) {\n    log.error(e.message);\n    log.debug(e);\n    process.exit(1);\n  }\n} else {\n  // we've been imported - just expose the machinery\n  module.exports = nabs;\n}\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/module.js */ \"./node_modules/webpack/buildin/module.js\")(module)))\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "commander":
/*!****************************!*\
  !*** external "commander" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"commander\");\n\n//# sourceURL=webpack:///external_%22commander%22?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ }),

/***/ "js-yaml":
/*!**************************!*\
  !*** external "js-yaml" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"js-yaml\");\n\n//# sourceURL=webpack:///external_%22js-yaml%22?");

/***/ }),

/***/ "jsonfile":
/*!***************************!*\
  !*** external "jsonfile" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"jsonfile\");\n\n//# sourceURL=webpack:///external_%22jsonfile%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "winston":
/*!**************************!*\
  !*** external "winston" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"winston\");\n\n//# sourceURL=webpack:///external_%22winston%22?");

/***/ })

/******/ })));