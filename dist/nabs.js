#!/usr/bin/env node
!function(e) {
  var n = {}

  function t(r) {
    if (n[r]) return n[r].exports
    var i = n[r] = { i: r, l: !1, exports: {} }
    return e[r].call(i.exports, i, i.exports, t), i.l = !0, i.exports
  }

  t.m = e, t.c = n, t.d = function(e, n, r) {
    t.o(e, n) || Object.defineProperty(e, n, { enumerable: !0, get: r })
  }, t.r = function(e) {
    'undefined' != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }), Object.defineProperty(e, '__esModule', { value: !0 })
  }, t.t = function(e, n) {
    if (1 & n && (e = t(e)), 8 & n) return e
    if (4 & n && 'object' == typeof e && e && e.__esModule) return e
    var r = Object.create(null)
    if (t.r(r), Object.defineProperty(r, 'default', {
      enumerable: !0,
      value: e
    }), 2 & n && 'string' != typeof e) for (var i in e) t.d(r, i, function(n) {
      return e[n]
    }.bind(null, i))
    return r
  }, t.n = function(e) {
    var n = e && e.__esModule ? function() {
      return e.default
    } : function() {
      return e
    }
    return t.d(n, 'a', n), n
  }, t.o = function(e, n) {
    return Object.prototype.hasOwnProperty.call(e, n)
  }, t.p = '', t(t.s = 0)
}([function(e, n, t) {
  'use strict';
  (function(e, n) {
    const r = t(2), i = t(3), s = t(4), o = t(5), a = t(6),
      c = t(7), { version: u } = JSON.parse(r.readFileSync(s.join(e, 'package.json'), 'utf8')), d = a.createLogger({
        format: a.format.combine(a.format.splat(), a.format.cli()),
        transports: [new a.transports.Console({ handleExceptions: !0, humanReadableUnhandledException: !0 })]
      }), l = {
        makeArray: function(e) {
          if ('string' == typeof e) return [e]
          if (Array.isArray(e)) return e.slice()
          if (null === e) return []
          throw new Error(`Item must be string, array or null: ${e}`)
        }, Task: class {
          constructor(e) {
            this.name = e, this.actions = [], this.dependencies = [], this.children = [], this.useChildrenAsDependencies = !0
          }

          addAction(e) {
            this.actions = this.actions.concat(l.makeArray(e))
          }

          addChild(e) {
            this.children.push(`${this.scriptName}:${e}`)
          }

          addDependency(e) {
            const n = this.scriptName, t = l.makeArray(e)
            this.useChildrenAsDependencies = !1, t.forEach((e, r) => {
              e.startsWith(':') && (t[r] = n + e)
            }), this.dependencies = this.dependencies.concat(t)
          }

          get scriptName() {
            return this.name.join(':')
          }

          get scriptValue() {
            let e = []

            function n(e) {
              return e.map(e => `npm run ${e}`)
            }

            if (0 === (e = (e = this.useChildrenAsDependencies ? n(this.children.sort()) : n(this.dependencies)).concat(this.actions)).length) throw new Error(`Tasks with no actions or dependencies are invalid: ${this}`)
            return e.join(' && ')
          }

          toString() {
            return this.scriptName
          }
        }, buildTasks: function(e, n) {
          const t = new l.Task(n)
          let r = [t]
          return 'string' == typeof e || Array.isArray(e) ? t.addAction(e) : (void 0 !== e.$depend && t.addDependency(e.$depend), void 0 !== e.$action && t.addAction(e.$action), Object.keys(e).filter(e => !e.startsWith('$')).forEach(i => {
            r = r.concat(l.buildTasks(e[i], n.concat(i))), t.addChild(i)
          })), r
        }, checkDependencies: function(e, n) {
          const t = new Set(n)
          e.forEach(e => {
            e.dependencies.forEach(n => {
              if (!t.has(n)) throw new Error(`Task ${e} has non-existent dependency: ${n}`)
            })
          })
        }, process: function(e) {
          const n = {}
          let t = []
          return d.info('Processing tasks...'), Object.keys(e).forEach(n => {
            t = t.concat(l.buildTasks(e[n], [n]))
          }), d.info('Building scripts...'), t.sort().forEach(e => {
            n[e.scriptName] = e.scriptValue
          }), d.info('Checking dependencies...'), l.checkDependencies(t, Object.keys(n)), n
        }, main: function(e) {
          const n = e.nabs || 'nabs.yml'
          d.info('Opening %s...', n)
          const t = c.safeLoad(r.readFileSync(n, 'utf8')), s = e.package || 'package.json'
          d.info('Opening %s...', s)
          const o = i.readFileSync(s, 'utf8')
          o.scripts = l.process(t), e.disable || (o.scripts.nabs = 'nabs'), d.info('Writing %s...', s), i.writeFileSync('package.json', o, {
            encoding: 'utf8',
            spaces: 2
          })
        }
      }
    if (o.version(u).option('-d, --disable', 'disable the default nabs regenerate task').option('-n, --nabs <file>', 'nabs.yml file (defaults to nabs.yml in current dir)').option('-p, --package <file>', 'package.json file (defaults to package.json in current dir)').option('-v, --verbose', 'pass up to 3 times to increase verbosity', (e, n) => n + 1, 0).parse(process.argv), d.level = ['error', 'warn', 'info', 'debug'][o.verbose || 0], n.parent) n.exports = l else {
      d.info('Starting nabs v%s', u)
      try {
        l.main(o)
      } catch (e) {
        d.error(e.message), d.debug(e), process.exit(1)
      }
    }
  }).call(this, '/', t(1)(e))
}, function(e, n) {
  e.exports = function(e) {
    return e.webpackPolyfill || (e.deprecate = function() {
    }, e.paths = [], e.children || (e.children = []), Object.defineProperty(e, 'loaded', {
      enumerable: !0,
      get: function() {
        return e.l
      }
    }), Object.defineProperty(e, 'id', {
      enumerable: !0, get: function() {
        return e.i
      }
    }), e.webpackPolyfill = 1), e
  }
}, function(e, n) {
  e.exports = require('fs')
}, function(e, n) {
  e.exports = require('jsonfile')
}, function(e, n) {
  e.exports = require('path')
}, function(e, n) {
  e.exports = require('commander')
}, function(e, n) {
  e.exports = require('winston')
}, function(e, n) {
  e.exports = require('js-yaml')
}])