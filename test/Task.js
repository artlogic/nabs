'use strict';

const chai = require('chai');
const nabs = require('../');

chai.should();

describe('Task', () => {
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
      task.addAction(action);
      task.actions.should.eql(action);

      task.addAction([]);
      task.actions.should.eql(action);

      action = action.concat(['four']);
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

      task.addDependency('');
      task.useChildrenAsDependencies.should.equal(false);
    });

    it('should concatenate the passed task with .dependencies', () => {
      let depend;
      const task = new nabs.Task([]);

      depend = ['one', 'two', 'three'];
      task.addDependency(depend);
      task.dependencies.should.eql(depend);

      task.addDependency([]);
      task.dependencies.should.eql(depend);

      depend = depend.concat(['four']);
      task.addDependency(['four']);
      task.dependencies.should.eql(depend);
    });

    it('it should fully qualify any shorthand tasks', () => {
      const depend = [':one', ':two', ':three'];
      const name = ['four', 'five'];
      const task = new nabs.Task(name);

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
    it('should npmify the children by default');
    it('should npmify the depends, otherwise');
    it('should add the actions to raw actions');
    it('should throw an error if no actions or depends');
    it('should return the raw actions joined with `&&`');
  });

  describe('.toString()', () => {
    it('should return .scriptName, when coerced', () => {
      const task = new nabs.Task(['one', 'two']);

      String(task).should.equal(task.scriptName);
    });
  });
});
