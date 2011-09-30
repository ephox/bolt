require('../include/include.js');

var analyser = ephox.bolt.kernel.module.analyser;
var ar = ephox.bolt.kernel.fp.array;

var allModulesLoaded = {
  A: ['D'],
  G: ['H'],
  H: [],
  C: ['G'],
  B: ['D'],
  D: []
};

var r0 = analyser.analyse(allModulesLoaded);

assert(r0.load && r0.load.length === 0, "analyser detects all modules loaded");

var unloadedModule = {
  A: ['D'],
  G: ['H'],
  H: [],
  C: ['G'],
  B: ['D']
};

var r1 = analyser.analyse(unloadedModule);

assert(r1.load && ar.equals(r1.load, ['D']), "analyser detects unloaded modules");

var cycle = {
  AA: ['A'],
  A: ['B'],
  B: ['C'],
  C: ['D'],
  D: ['A']
};

var r2 = analyser.analyse(cycle);

assert(r2.cycle && ar.equals(r2.cycle, ['A', 'B', 'C', 'D', 'A']), "analyser detects cycles");
