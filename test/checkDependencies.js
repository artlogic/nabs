'use strict';

const chai = require('chai');
const nabs = require('../');

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
