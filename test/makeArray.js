'use strict';

const chai = require('chai');
const nabs = require('../');

chai.should();

describe('makeArray', () => {
  it('should return [string] if passed string', () => {
    nabs.makeArray('test').should.eql(['test']);
    nabs.makeArray('').should.eql(['']);
    nabs.makeArray('multi word string').should.eql(['multi word string']);
  });

  it('should return [] if passed []', () => {
    let array;

    array = [];
    nabs.makeArray(array).should.equal(array);

    array = ['this'];
    nabs.makeArray(array).should.equal(array);

    array = [1, 2, 3];
    nabs.makeArray(array).should.equal(array);
  });

  it('should return empty [] if passed null', () => {
    nabs.makeArray(null).should.eql([]);
  });

  it('should throw an error otherwise', () => {
    (() => nabs.makeArray()).should.throw(/Item must be string, array or null: .*/);
    (() => nabs.makeArray({})).should.throw(/Item must be string, array or null: .*/);
    (() => nabs.makeArray(0)).should.throw(/Item must be string, array or null: .*/);
    (() => nabs.makeArray(true)).should.throw(/Item must be string, array or null: .*/);
  });
});
