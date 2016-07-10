# karma-tape

> Adapter for the [tape](https://github.com/substack/tape) testing framework.

## Installation
```bash
$ npm install karma-tape --save-dev
```

## Configuration
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['tape'],

    files: [
      'src/*.js',
      'test/*.js'
    ],

    reporters: ['spec'],
  })
}
```

## Example

just write your tests without requiring **tape**

```js
// var test = require('tape'); // no need to require tape

test('timing test', function (t) {
  t.plan(2);

  t.equal(typeof Date.now, 'function');
  var start = Date.now();

  setTimeout(function () {
      t.equal(Date.now() - start, 100);
  }, 100);
});
```

## License

[MIT](https://opensource.org/licenses/MIT)


----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com
