# Not Another Build System (nabs)

nabs is a compiler that turns a nicely structured YAML file into script entries in your `package.json`. npm is a great minimal task runner that's already installed along with node. However, a large number of multi-action tasks in your `package.json` can be hard to manage. That's where nabs comes in. You can write your tasks in much easier to manage format and then compile them into standard script entries.

Note: nabs is only designed to work in Bourne shell compatible environments.

## Basic format

Start by putting a `nabs.yml` in the same directory as your `package.json`. The document is a mapping (dictionary) of tasks:

```yaml
# my tasks
lint: eslint .
minify: uglifyjs js/main.js -o js/main.min.js
```

The key is the task name, the value is a shell command to run. This is already a slight improvement over `package.json` because you can add comments and generally omit quotes.

## Nested tasks

Actions can be nested, creating a hierarchy. Only leaves in the hierarchy can have action values (unless you [override the defaults](#overriding-defaults)). Nested action names will be separated by colons in `package.json`.

```yaml
test:
  server: mocha --recursive test/server
  client: mocha --recursive test/client
```

This will create three entries in `package.json`:

```json
"scripts": {
  "test": "npm run test:client && npm run test:server",
  "test:server": "mocha --recursive test/server",
  "test:client": "mocha --recursive test/client"
}
```

Parent tasks run their subtasks in alphabetical order.

Because colon is used as the task separator, you probably should avoid embedding colons in your nabs task names. It's also a good idea to avoid starting task names with a period. See [Dependencies](#dependencies) below.

## Multi-action tasks

You can create a multi-action task by embedding a sequence as the mapping's value:

```yaml
publish-spec:
  - git checkout gh-pages
  - mv spec.html index.html
  - git add index.html
  - git commit -m 'Publishing...'
  - git push
  - git checkout master
```

This will create a `package.json` entry like this:

```json
"scripts": {
  "publish-spec": "git checkout gh-pages && mv spec.html index.html && git add index.html && git commit -m 'Publishing...' && git push && git checkout master"
}
```

If any individual action fails, the entire task will fail.

## Dependencies

Any task can have dependencies that must be run prior to execution. They can be specified by setting the value of the task to a mapping with a `.depend` property and an `.action` property. The `.action` property contains either a single action (a string) or a list of actions (sequence). The `.depend` property contains a sequence of task names that must be run prior to this task.

```yaml
spec:
  generate: jsdoc -c .jsdocrc
  publish:
    .depend: [spec:generate]
    .action:
      - rm prod
      - mv out prod
```

The above will generate the following `package.json` entries:

```json
"scripts": {
  "spec": "npm run spec:publish",
  "spec:generate": "jsdoc -c .jsdocrc",
  "spec:publish": "npm run spec:generate && rm prod && mv out prod"
}
```

Notice that nabs is smart enough to know that running `spec:publish` will run `spec:generate` and so it's not run twice by the `spec` task.

## Overriding defaults

Parent tasks in a hierarchy have a default set of dependencies - namely, their children in alphabetical order. This can be overridden by setting the `.depend` property on the parent to any valid sequence of tasks, including the empty sequence.

Generally the `.action` property on parent tasks is empty. It's possible to set this as well if desired. This is useful when you'd like to use parent tasks to group related tasks that shouldn't neccesarily exhibit the default parent/child relationship. For example:

```yaml
migrate:
  .depend: []
  .action: sequelize db:migrate
  create: sequelize migration:create
  undo: sequelize db:migrate:undo
```

This will create a `package.json` with the following entries:

```json
"scripts": {
  "migrate:create": "sequelize migration:create",
  "migrate:undo": "sequelize db:migrate:undo",
  "migrate": "sequelize db:migrate"
}
```

## Future enhancements

* Ignore action errors (use `;` instead of `&&` for certain tasks)... end with `; true` if necessary (won't work on windows).
* Info/warning messages when using npm's special names (e.g. publish, install, uninstall, version, and all variations).
* Platform independence? (https://github.com/shelljs/shx, https://www.npmjs.com/package/bashful)
* Allow actions to be embedded JS snippets as an alternative to shell commands. They might be output into `./scripts`.
* File based tasks - that is, operate on all .js files... Need to be able to ignore dirs globally, and on case by case... Look at grunt for this. Any set of params should compile to a find command.
* Explicit support for pre/post hooks?
* Support for watching files/folders and kicking off tasks (nodemon, onchange).
* Support for parallel tasks (parallelshell).
* Reusable actions?

## References/inspiration

* https://docs.npmjs.com/misc/scripts
* https://www.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/
* https://medium.freecodecamp.com/why-i-left-gulp-and-grunt-for-npm-scripts-3d6853dd22b8
* https://css-tricks.com/why-npm-scripts/
