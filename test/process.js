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
const td = require('testdouble');

const nabs = require('../dist/nabs').default;

chai.should();

describe('process', () => {
  beforeEach(() => {
    nabs.buildTasks = td.function('buildTasks');
    nabs.checkDependencies = td.function('checkDependdencies');
  });

  afterEach(() => {
    td.reset();
  });

  it('should process the tasks properly', () => {
    const name = 'test';
    const action = 'my action';
    const task = new nabs.Task([name]);

    task.addAction(action);

    td.when(nabs.buildTasks(td.matchers.anything(), td.matchers.isA(Array)))
      .thenReturn([task]);

    const scripts = nabs.process({ [name]: action });
    scripts.should.have.property(name);
    scripts[name].should.equal(action);

    td.verify(nabs.checkDependencies([task], ['test']));
  });
});
