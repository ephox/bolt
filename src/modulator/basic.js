compiler.modulator.basic = def(
  [
    ephox.bolt.module.modulator.basic,
    compiler.tools.io
  ],

  function (delegate, io) {
    var create = function () {
      var instance = delegate.create.apply(null, arguments);

      var can = function () {
        return instance.can.apply(null, arguments);
      };

      var modulate = function (id) {
        var spec = instance.modulate.apply(null, arguments);

        var content = io.read(spec.url);

        var render = function () {
          return '(function (define, require) {\n' +
               content + '\n' +
            '})(ephox.bolt.module.runtime.define, ephox.bolt.module.runtime.require);\n';
        };

        var load = function (define /* eval scope */) {
          eval(content);
        };

        var config = function () {
          return 'ephox.bolt.module.modulator.basic.create("' + id + '", pather("."), function (x) { return x + ".js"})';
        };

        return {
          url: spec.url,
          serial: spec.serial,
          render: render,
          config: config,
          load: load
        };
      };

      return {
        can: can,
        modulate: modulate
      };
    };

    return {
      create: create
    };
  }
);

// wrap basic modulator for compilation.
ephox.bolt.module.modulator.basic = compiler.modulator.basic;
