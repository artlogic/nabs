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

const fs = require('fs');
const { resolve } = require('path');
const jsonfile = require('jsonfile');
const yaml = require('js-yaml');
const log = require('./logger');
const processTasks = require('./utils/process');

function main(options) {
  const nabsFile = options.nabs || resolve('nabs.yml');
  log.info('Opening %s...', nabsFile);
  const tasks = yaml.safeLoad(fs.readFileSync(nabsFile, 'utf8'));

  const pkgFile = options.package || 'package.json';
  log.info('Opening %s...', pkgFile);
  const pkg = jsonfile.readFileSync(pkgFile, 'utf8');

  pkg.scripts = processTasks(tasks);

  if (!options.disable && !pkg.scripts.nabs) {
    pkg.scripts.nabs = 'nabs';
  }

  log.info('Writing %s...', pkgFile);
  jsonfile.writeFileSync('package.json', pkg, {
    encoding: 'utf8',
    spaces: 2,
  });
}

module.exports = main;
