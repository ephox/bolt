kernel.fp.array = def(
  [
  ],

  function () {
    var equals = function (a1, a2) {
      if (a1.length !== a2.length)
        return false;
      for (var i = 0; i < a1.length; ++i)
        if (a1[i] !== a2[i])
          return false;
      return true;
    };

    var forall = function (a, f) {
      var fn = f || function (x) { return x === true; };
      for (var i = 0; i < a.length; ++i)
        if (fn(a[i]) !== true)
          return false;
      return true;
    };

    var map = function (a, f) {
      var r = [];
      for (var i = 0; i < a.length; ++i)
        r.push(f(a[i]));
      return r;
    };
    
    var each = map;

    var contains = function (a, x) {
      return !forall(a, function (v) {
	return v !== x;
      });
    };

    return {
      equals: equals,
      map: map,
      each: each,
      forall: forall,
      contains: contains
    };
  }
);
