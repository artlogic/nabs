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
const nabs = require('../dist').default;

chai.should();

describe('Task', () => {
  beforeEach(() => {
    td.replace(nabs, 'makeArray');
  });

  afterEach(() => {
    td.reset();
  });

  describe('.constructor(name)', () => {
    it('should initialize all properties properly', () => {
      const name = [];
      const task = new nabs.Task(name);

      task.name.should.equal(name);
      task.actions.should.eql([]);
      task.dependencies.should.eql([]);
      task.children.should.eql([]);
      task.useChildrenAsDependencies.should.equal(true);
    });
  });

  describe('.addAction(action)', () => {
    it('should concatenate the passed action with .action', () => {
      let action;
      const task = new nabs.Task([]);

      action = ['one', 'two', 'three'];
      td.when(nabs.makeArray(action)).thenReturn(action);
      task.addAction(action);
      task.actions.should.eql(action);

      td.when(nabs.makeArray([])).thenReturn([]);
      task.addAction([]);
      task.actions.should.eql(action);

      action = action.concat(['four']);
      td.when(nabs.makeArray(['four'])).thenReturn(['four']);
      task.addAction(['four']);
      task.actions.should.eql(action);
    });
  });

  describe('.addChild(child)', () => {
    it('should add the fully qualified child to .children', () => {
      let child;
      const task = new nabs.Task(['one', 'two']);

      child = 'three';
      task.addChild(child);
      task.children.slice(-1)[0]
        .should.equal(`${task.scriptName}:${child}`);

      child = 'four';
      task.addChild(child);
      task.children.slice(-1)[0]
        .should.equal(`${task.scriptName}:${child}`);
    });
  });

  describe('.addDependency(task)', () => {
    it('should set .useChildrenAsDependencies to false', () => {
      const task = new nabs.Task([]);

      td.when(nabs.makeArray('')).thenReturn([]);
      task.addDependency('');
      task.useChildrenAsDependencies.should.equal(false);
    });

    it('should concatenate the passed task with .dependencies', () => {
      let depend;
      const task = new nabs.Task([]);

      depend = ['one', 'two', 'three'];
      td.when(nabs.makeArray(depend)).thenReturn(depend);
      task.addDependency(depend);
      task.dependencies.should.eql(depend);

      td.when(nabs.makeArray([])).thenReturn([]);
      task.addDependency([]);
      task.dependencies.should.eql(depend);

      depend = depend.concat(['four']);
      td.when(nabs.makeArray(['four'])).thenReturn(['four']);
      task.addDependency(['four']);
      task.dependencies.should.eql(depend);
    });

    it('it should fully qualify any shorthand tasks', () => {
      const depend = [':one', ':two', ':three'];
      const name = ['four', 'five'];
      const task = new nabs.Task(name);

      td.when(nabs.makeArray(depend)).thenReturn(depend.slice());
      task.addDependency(depend);
      task.dependencies.forEach((item, index) => {
        item.should.equal(task.scriptName + depend[index]);
      });
    });
  });

  describe('.scriptName', () => {
    it('should return the textual task name', () => {
      const name = ['one', 'two'];
      const task = new nabs.Task(name);

      task.scriptName.should.equal(name.join(':'));
    });
  });

  describe('.scriptValue', () => {
    it('should npmify the sorted children by default', () => {
      const task = new nabs.Task(['test']);
      const children = ['x', 'y', 'z'];

      task.addChild(children[1]);
      task.addChild(children[0]);
      task.addChild(children[2]);

      const items = task.scriptValue.split(' && ');
      items.length.should.equal(3);
      items.forEach((item, index) => {
        item.should.match(/npm run ./);
        item.endsWith(children[index]).should.equal(true);
      });
    });

    it('should npmify the depends, otherwise', () => {
      const task = new nabs.Task(['test']);
      const depends = ['y', 'z', 'x'];

      td.reset(); // use the default makeArray
      task.addDependency(depends[0]);
      task.addDependency(depends[1]);
      task.addDependency(depends[2]);

      const items = task.scriptValue.split(' && ');
      items.length.should.equal(3);
      items.forEach((item, index) => {
        item.should.match(/npm run ./);
        item.endsWith(depends[index]).should.equal(true);
      });
    });

    it('should add the actions to raw actions', () => {
      const task = new nabs.Task(['test']);
      const actions = ['y', 'z', 'x'];

      td.reset(); // use the default makeArray
      task.addAction(actions[0]);
      task.addAction(actions[1]);
      task.addAction(actions[2]);

      const items = task.scriptValue.split(' && ');
      items.length.should.equal(3);
      items.forEach((item, index) => {
        item.should.equal(actions[index]);
      });
    });

    it('should throw an error if no actions or depends', () => {
      const task = new nabs.Task([]);

      (() => task.scriptValue)
        .should.throw(/Tasks with no actions or dependencies are invalid: .*/);
    });
  });

  describe('.toString()', () => {
    it('should return .scriptName, when coerced', () => {
      const task = new nabs.Task(['one', 'two']);

      String(task).should.equal(task.scriptName);
    });
  });
});
