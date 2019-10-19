// nabs - Not another build system. Easy management of package.json scripts.
//
// Copyright (C) 2016 James Kruth
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

const chai = require('chai');
const nabs = require('../dist/nabs').default;

const should = chai.should();

describe('checkDependencies', () => {
  let tasks;
  let names;

  before(() => {
    tasks = [
      { dependencies: ['one', 'two', 'three'] },
      { dependencies: ['four'] },
      { dependencies: [] },
      { dependencies: ['five', 'six'] },
    ];
  });

  it("should throw an error if a dependency doesn't exist", () => {
    names = [];
    (() => { nabs.checkDependencies(tasks, names); })
      .should.throw(/Task .+? has non-existent dependency: one/);

    names = ['junk'];
    (() => { nabs.checkDependencies(tasks, names); })
      .should.throw(/Task .+? has non-existent dependency: one/);

    names = ['one', 'two', 'three', 'four', 'five'];
    (() => { nabs.checkDependencies(tasks, names); })
      .should.throw(/Task .+? has non-existent dependency: six/);
  });

  it('should not throw an error if all dependencies exist', () => {
    names = ['one', 'two', 'three', 'four', 'five', 'six'];
    should.equal(nabs.checkDependencies(tasks, names), undefined);

    names = ['one', 'two', 'three', 'four', 'five', 'six', 'seven'];
    should.equal(nabs.checkDependencies(tasks, names), undefined);

    names = ['one', 'two', 'three', 'four', 'five', 'six', 'six'];
    should.equal(nabs.checkDependencies(tasks, names), undefined);
  });
});
