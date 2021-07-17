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

const chai = require('chai');
const td = require('testdouble');

const Task = require('../src/Task');

chai.should();

let checkDependencies;
let buildTasks;
let process;
describe('process', () => {
  beforeEach(() => {
    buildTasks = td.replace('../src/utils/buildTasks');
    checkDependencies = td.replace('../src/utils/checkDependencies');
    // eslint-disable-next-line global-require
    process = require('../src/utils/process');
  });

  afterEach(() => {
    td.reset();
  });

  it('should process the tasks properly', () => {
    const name = 'test';
    const action = 'my action';
    const task = new Task([name]);

    task.addAction(action);

    td.when(buildTasks(td.matchers.anything(), td.matchers.isA(Array)))
      .thenReturn([task]);

    const scripts = process({ [name]: action });
    scripts.should.have.property(name);
    scripts[name].should.equal(action);

    td.verify(checkDependencies([task], ['test']));
  });
});
