require('../include/include.js');

var obj = ephox.bolt.kernel.fp.object;
var ar = ephox.bolt.kernel.fp.array;

var keys = [];
var values = [];
obj.each({a: 1, b: 2, c: 3}, function (k, v) {
  keys.push(k);
  values.push(v);
});

assert(ar.equals(keys, ['a', 'b', 'c']), "oeach passes key as first argument");
assert(ar.equals(values, [1, 2, 3]), "oeach passes value as second argument");


var maps = obj.map({a: 1, b: 2, c: 3}, function (k, v) {
  return v * 2;
});

assert(maps.a === 2 && maps.b === 4 && maps.c === 6, "omap should map values");