// nabs - Not another build system. Easy management of package.json scripts.
//
// Copyright (C) 2016 James Kruth
//
// This file is part of
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
// along with this   If not, see <http://www.gnu.org/licenses/>.

const chai = require('chai');
const nabs = require('../src');

chai.should();

describe('nabs.buildTasks', () => {
  it('should return a single task if tasks is string/array', () => {
    const name = [];
    let scripts;
    let tasks;

    tasks = 'echo hello';
    scripts = nabs.buildTasks(tasks, name);
    scripts.should.be.instanceof(Array);
    scripts.length.should.equal(1);
    scripts[0].should.be.instanceof(nabs.Task);
    scripts[0].name.should.equal(name);
    scripts[0].actions.length.should.equal(1);
    scripts[0].actions[0].should.equal(tasks);

    // change for array
    tasks = [
      'echo hello',
      'echo goodbye',
    ];
    scripts = nabs.buildTasks(tasks, name);
    scripts.should.be.instanceof(Array);
    scripts.length.should.equal(1);
    scripts[0].should.be.instanceof(nabs.Task);
    scripts[0].name.should.equal(name);
    scripts[0].actions.should.eql(tasks);
  });

  it('should add task.actions for $action', () => {
    const name = [];
    const tasks = { $action: 'echo hello' };
    const scripts = nabs.buildTasks(tasks, name);

    scripts.should.be.instanceof(Array);
    scripts.length.should.equal(1);
    scripts[0].should.be.instanceof(nabs.Task);
    scripts[0].name.should.equal(name);
    scripts[0].actions.length.should.equal(1);
    scripts[0].actions[0].should.equal(tasks.$action);
  });

  it('should add task.dependencies for $depend', () => {
    const name = ['test'];
    const tasks = { $depend: 'test:unit' };
    const scripts = nabs.buildTasks(tasks, name);

    scripts.should.be.instanceof(Array);
    scripts.length.should.equal(1);
    scripts[0].should.be.instanceof(nabs.Task);
    scripts[0].name.should.equal(name);
    scripts[0].dependencies.length.should.equal(1);
    scripts[0].dependencies[0].should.equal(tasks.$depend);
  });

  it('should add task.children for children', () => {
    const name = ['test'];
    const tasks = {
      sub1: 'echo hello',
      sub2: 'echo goodbye',
    };
    const scripts = nabs.buildTasks(tasks, name);

    scripts.should.be.instanceof(Array);
    scripts.length.should.equal(3);
    scripts[0].should.be.instanceof(nabs.Task);
    scripts[0].name.should.equal(name);
    scripts[0].children.length.should.equal(2);
    scripts[0].children[0].should.equal('test:sub1');
    scripts[0].children[1].should.equal('test:sub2');
  });

  it('should ignore children that start with $', () => {
    const name = ['test'];
    const tasks = {
      sub1: 'echo hello',
      sub2: 'echo goodbye',
      $junk: 'ignore me',
    };
    const scripts = nabs.buildTasks(tasks, name);

    scripts.should.be.instanceof(Array);
    scripts.length.should.equal(3);
    scripts[0].should.be.instanceof(nabs.Task);
    scripts[0].name.should.equal(name);
    scripts[0].children.length.should.equal(2);
    scripts[0].children[0].should.equal('test:sub1');
    scripts[0].children[1].should.equal('test:sub2');
  });

  it('should call itself recursively for each key', () => {});
});
