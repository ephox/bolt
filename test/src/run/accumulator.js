test.run.accumulator = def(
  [
    Function('return this;')(),
    ephox.bolt.kernel.fp.functions
  ],

  function (global, fn) {
    var tests = [];

    var push = function (wrapper, testfile, name, replacements, deps, fn) {
      if (typeof deps === 'function' && fn === undefined) {
        fn = deps;
        deps = replacements;
        replacements = {};
      }

      var args = [ wrapper, testfile, name, replacements, deps, fn ];
      tests.push(args);
    };

    var more = function () {
      return tests.length > 0;
    };

    var take = function () {
      if (tests.length > 0)
        return tests.shift();
      throw 'No more, call more() before take().';
    };

    var drain = function (runtest, done) {
      if (more())
        runtest.apply(null, [ fn.curry(drain, runtest, done) ].concat(take()));
      else
        done();
    };

    var register = function (testfile, syncwrapper, asyncwrapper, domwrapper) {

      global.test = function (name, replacements, deps, fn) {
        push(syncwrapper, testfile, name, replacements, deps, fn);
      };

      global.asynctest = function (name, replacements, deps, fn) {
        push(asyncwrapper, testfile, name, replacements, deps, fn);
      };

      global.domtest = function (name, replacements, deps, fn) {
        push(domwrapper, testfile, name, replacements, deps, fn);
      };
    };

    var cancel = function () {
      tests.splice(0);
    };

    var length = function () {
      return tests.length;
    };

    return {
      more: more,
      length: length,
      take: take,
      drain: drain,
      register: register,
      cancel: cancel
    };
  }
);
