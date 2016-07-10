/* globals
  createTapeReporter
 */

var setupTest = function setupTest () {
  var Karma = window.__karma__.constructor
  var tc = new Karma(new MockSocket(), null, null, null, {search: ''})

  var stream = new Emitter()
  var reporter = new createTapeReporter(tc, stream) // eslint-disable-line

  return {
    stream: stream,
    tc: tc
  }
}

test('adapter', function (t) {
  t.ok(window.__tapeTests, '__tapeTests should be defined')
  t.equal(Object.prototype.toString.call(window.__tapeTests), '[object Array]', '__tapeTests should be an Array')
  t.equal(window.__tapeTests.length, 4, '__tapeTests should contains 4 items')

  t.end()
})

test('reporter', function (t) {
  var env = setupTest()
  var tc = env.tc
  var stream = env.stream

  sinon.stub(tc, 'result')
  var completeStub = sinon.stub(tc, 'complete')

  stream.emit('data', { type: 'assert' })

  t.ok(tc.result.called, 'should call tc.result on assert')
  t.ok(tc.result.calledBefore(completeStub), 'should call tc.result before tc.complete')
  t.equal(tc.result.callCount, 1, 'should call tc.result once')

  stream.emit('close')

  t.ok(tc.complete.called, 'should call tc.complete when stream is closed')
  t.equal(tc.complete.callCount, 1, 'should call tc.complete once')

  t.end()
})

test('ok assert', function (t) {
  var env = setupTest()
  var tc = env.tc
  var stream = env.stream

  sinon.stub(tc, 'result')

  stream.emit('data', {
    type: 'test',
    id: 0,
    name: 'test-name'
  })

  stream.emit('data', {
    type: 'assert',
    id: 0,
    name: 'assert-name',
    ok: true,
    test: 0
  })

  var resultArgs = tc.result.args[0][0]

  var actualArgs = {
    id: resultArgs.id,
    description: resultArgs.description,
    success: resultArgs.success,
    log: resultArgs.log,
    suite: resultArgs.suite
  }

  var expectedArgs = {
    id: 0,
    description: 'assert-name',
    success: true,
    log: [],
    suite: ['test-name']
  }

  t.deepEqual(actualArgs, expectedArgs, 'should receive exact arguments')

  t.end()
})

test('notOk assert', function (t) {
  var env = setupTest()
  var tc = env.tc
  var stream = env.stream

  sinon.stub(tc, 'result')

  stream.emit('data', {
    type: 'test',
    id: 0,
    name: 'test-name'
  })

  stream.emit('data', {
    type: 'assert',
    id: 0,
    name: 'assert-name',
    ok: false,
    test: 0,
    operator: 'equal',
    expected: '1',
    actual: '0'
  })

  var resultArgs = tc.result.args[0][0]

  var actualArgs = {
    id: resultArgs.id,
    description: resultArgs.description,
    success: resultArgs.success,
    log: resultArgs.log,
    suite: resultArgs.suite
  }

  var expectedArgs = {
    id: 0,
    description: 'assert-name',
    success: false,
    log: [
      'operator: equal',
      'expected: 1',
      'actual: 0'
    ],
    suite: ['test-name']
  }

  t.deepEqual(actualArgs, expectedArgs, 'should receive exact arguments')

  t.end()
})
