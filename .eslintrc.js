module.exports = {
  "extends": "airbnb-base",
  "plugins": [
    "import"
  ],
  "rules": {
    "strict": [
      2,
      "safe"
    ],
    "import/no-extraneous-dependencies": [
      "error", {
        "devDependencies": ["**/webpack.*.js"]
      }
    ],
  }
}
