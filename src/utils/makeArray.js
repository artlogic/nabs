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

// utility function - string -> [string], [] -> copy of [], null -> []
function makeArray(item) {
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
}

module.exports = makeArray;
