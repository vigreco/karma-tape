var getTapeStream = function getTapeStream () {
  return window.tape.createStream({ objectMode: true })
}

var formatError = function formatError (data) {
  var err = [
    'operator: ' + data.operator
  ]

  if (data.expected) {
    err.push('expected: ' + data.expected)
  }

  if (data.actual) {
    err.push('actual: ' + data.actual)
  }

  return err
}

var createTapeReporter = function createTapeReporter (tc, tapeStream) {
  var assertStartTime = null
  var suites = {}

  tapeStream.on('data', function (data) {
    switch (data.type) {
      case 'test':
        assertStartTime = new Date().getTime()
        suites[data.id] = data.name
        break

      case 'assert':
        var currentTime = new Date().getTime()

        tc.result({
          id: data.id,
          description: data.name,
          success: data.ok,
          log: data.ok ? [] : formatError(data),
          suite: [suites[data.test]],
          time: currentTime - assertStartTime
        })

        assertStartTime = currentTime
        break
    }
  })

  tapeStream.on('close', function () {
    tc.complete({
      coverage: window.__coverage__
    })
  })
}

var runTest = function runTest (test) {
  return test()
}

/* eslint-disable no-unused-vars */
var createStartFn = function (tc) {
  window.__tapeTests = []

  // wrap each test in a function call
  window.tape.test =
  window.test = function () {
    var args = arguments

    window.__tapeTests.push(
      function () {
        window.tape.apply(null, args)
      }
    )
  }

  return function (config) {
    createTapeReporter(tc, getTapeStream())

    // run the tests
    window.__tapeTests.forEach(runTest)

    // This should be called on start to inform karma of how many
    // tests we are going to run (useful for progress indication).
    // Unfortuately tape will not provide this info until the end of the tests.
    // It's not very useful in this case...let's keep it here just to avoid a warning msg
    tc.info({ total: 0 })
  }
}
