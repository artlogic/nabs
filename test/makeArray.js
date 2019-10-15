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

'use strict';

const chai = require('chai');
const nabs = require('../dist/nabs');

chai.should();

describe('makeArray', () => {
  it('should return [string] if passed string', () => {
    nabs.makeArray('test').should.eql(['test']);
    nabs.makeArray('').should.eql(['']);
    nabs.makeArray('multi word string').should.eql(['multi word string']);
  });

  it('should return a copy of [] if passed []', () => {
    let array;

    array = [];
    nabs.makeArray(array).should.eql(array);
    nabs.makeArray(array).should.not.equal(array);

    array = ['this'];
    nabs.makeArray(array).should.eql(array);
    nabs.makeArray(array).should.not.equal(array);

    array = [1, 2, 3];
    nabs.makeArray(array).should.eql(array);
    nabs.makeArray(array).should.not.equal(array);
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
