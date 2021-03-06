var Benchmark = require('benchmark');

run([

  bench('Native .lastIndexOf() vs fast.lastIndexOf() vs underscore.lastIndexOf() vs lodash.lastIndexOf() (3 items)', require('./last-index-of-3')),
  bench('Native .lastIndexOf() vs fast.lastIndexOf() vs underscore.lastIndexOf() vs lodash.lastIndexOf() (10 items)', require('./last-index-of-10')),
  bench('Native .lastIndexOf() vs fast.lastIndexOf() vs underscore.lastIndexOf() vs lodash.lastIndexOf() (1000 items)', require('./last-index-of-1000')),

  bench('Native .indexOf() vs fast.indexOf() vs underscore.indexOf() vs lodash.indexOf() (3 items)', require('./index-of-3')),
  bench('Native .indexOf() vs fast.indexOf() vs underscore.indexOf() vs lodash.indexOf() (10 items)', require('./index-of-10')),
  bench('Native .indexOf() vs fast.indexOf() vs underscore.indexOf() vs lodash.indexOf() (1000 items)', require('./index-of-1000')),

  bench('Native .bind() vs fast.bind() vs underscore.bind() vs lodash.bind()', require('./bind')),
  bench('Native .bind() vs fast.bind() vs underscore.bind() vs lodash.bind() with prebound functions', require('./bind-prebound')),

  bench('Native .bind() vs fast.partial() vs underscore.partial() vs lodash.partial()', require('./partial')),
  bench('Native .bind() vs fast.partial() with prebound functions', require('./partial-prebound')),

  bench('Native .map() vs fast.map() vs underscore.map() vs lodash.map() (3 items)', require('./map-3')),
  bench('Native .map() vs fast.map() vs underscore.map() vs lodash.map() (10 items)', require('./map-10')),
  bench('Native .map() vs fast.map() vs underscore.map() vs lodash.map() (1000 items)', require('./map-1000')),

  bench('Native .reduce() vs fast.reduce() vs underscore.reduce() vs lodash.reduce() (3 items)', require('./reduce-3')),
  bench('Native .reduce() vs fast.reduce() vs underscore.reduce() vs lodash.reduce() (10 items)', require('./reduce-10')),
  bench('Native .reduce() vs fast.reduce() vs underscore.reduce() vs lodash.reduce() (1000 items)', require('./reduce-1000')),

  bench('Native .forEach() vs fast.forEach() vs underscore.forEach() vs lodash.forEach() (3 items)', require('./for-each-3')),
  bench('Native .forEach() vs fast.forEach() vs underscore.forEach() vs lodash.forEach() (10 items)', require('./for-each-10')),
  bench('Native .forEach() vs fast.forEach() vs underscore.forEach() vs lodash.forEach() (1000 items)', require('./for-each-1000')),

  bench('Native .concat() vs fast.concat() vs underscore.concat() vs lodash.concat() (3 items)', require('./concat-3')),
  bench('Native .concat() vs fast.concat() vs underscore.concat() vs lodash.concat() (10 items)', require('./concat-10')),
  bench('Native .concat() vs fast.concat() vs underscore.concat() vs lodash.concat() (1000 items)', require('./concat-1000'))

]);

function bench (title, config) {
  return function (next) {
    var suite = new Benchmark.Suite();
    var keys = Object.keys(config),
        total = keys.length,
        key, i;

    for (i = 0; i < total; i++) {
      key = keys[i];
      suite.add(key, config[key]);
    }

    suite.on('start', function () {
      console.log('  ' + title);
    });
    suite.on('cycle', function (event) {
      console.log("    \033[0;32m\✓\033[0m \033[0;37m " + event.target + "\033[0m");
    });
    suite.on('complete', function () {
      var fastest = this.filter('fastest')[0],
          slowest = this.filter('slowest')[0],
          diff = fastest.hz - slowest.hz,
          percentage = ((diff / slowest.hz) * 100).toFixed(2);

      console.log('\n    \033[0;37mWinner is:\033[0m ' + this.filter('fastest').pluck('name') + ' \033[0;37m(\033[0m' + percentage + '%\033[0;37m faster)\033[0m\n');
      next();
    });
    suite.run({
      async: true
    });
  }
}


function run (benchmarks) {
  var index = -1,
      length = benchmarks.length,
      startTime = Date.now();

  console.log('  \033[0;37mRunning ' + length + ' benchmarks, please wait...\033[0m\n');
  function continuation () {
    index++;
    if (index < length) {
      benchmarks[index](continuation);
    }
    else {
      var endTime = Date.now(),
          total = Math.ceil((endTime - startTime) / 1000);
      console.log('  \n\033[0;37mFinished in ' + total + ' seconds\033[0m\n');
    }
  }
  continuation();
}
