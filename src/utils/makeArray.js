'use strict';

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
