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

// look for missing dependencies
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

module.exports = checkDependencies;
