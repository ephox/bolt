test.run.runner = def(
  [
    test.run.test,
    require('path')
  ],

  function (test, path) {
    var one = function (reporter, reader, testfile, next) {
      var testcase = path.resolve(testfile);
      var t = test.create(reporter, reader, testcase, next);
      global.test = t.test; 
      require(testcase);
      if (!t.hastests())
        next();
    };

    var run = function (reporter, reader, tests) {
      var loop = function () {
        if (tests.length > 0)
          one(reporter, reader, tests.shift(), loop);
        else
          reporter.done();
      };
      loop();
    };

    return {
      run: run
    };
  }
);
