compiler.mode.link = def(
  [
    compiler.tools.error,
    compiler.tools.io,
    compiler.bootstrap.generator,
    compiler.compile.configurator,
    compiler.meta.metalator,
    ephox.bolt.kernel.fp.array,
    require('path')
  ],

  function (error, io, generator, configurator, metalator, ar, path) {

    var slurp = function (file) {
      if (!metalator.hasMetadata(file))
        error.die('no meta-data found for file, "' + file + '", can only link compile output');
      var defines = metalator.inspect(file);
      return {file: file, defines: defines};
    };

    var configthing = function (bit) {
      var defines = bit.defines;
      var filepath = bit.file;
      var name = path.basename(filepath, '.js');
      return defines.map(function (define) {
        return 'source("amd", "' + define + '", ".", mapper.constant("' + name + '"))';
      });
    };

    var install =
      '(function () {\n' +
      '  var pather = ephox.bolt.module.bootstrap.pather;\n' +
      '  var install = ephox.bolt.module.bootstrap.install;\n' +
      '  install.install(pather.compile());\n' +
      '})();';

    var link = function (files) {
      var bits = files.map(slurp);
      return ar.flatmap(bits, configthing);
    };

    var run = function (config /*, files, target */) {
      var rest = Array.prototype.slice.call(arguments, 1);
      var files = rest.slice(0, -1);
      var target = rest[rest.length - 1];
      var parts = link(files);
      var sources = parts.join(',\n    ');

      var configuration =
        '(function () {\n' +
        '  var configure = ephox.bolt.module.api.configure;\n' +
        '  var source = ephox.bolt.module.api.source;\n' +
        '  var mapper = ephox.bolt.module.api.mapper;\n' +
        '  configure({' +
        '    sources: [\n' +
        '    ' + sources + '\n' +
        '    ]' +
          '});\n' +
        '})();';

      generator.generate(target, install + '\n' + configuration);
    };

    return {
      run: run
    };
  }
);
