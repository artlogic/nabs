module.exports = {
  env: {
    mocha: true,
  },
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: true },
    ],
  },
};
