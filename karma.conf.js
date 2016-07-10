module.exports = function (config) {
  config.set({
    frameworks: ['tape', 'sinon'],
    files: [
      'src/adapter.js',
      'test/*.js'
    ],
    plugins: [
      'karma-firefox-launcher',
      'karma-chrome-launcher',
      'karma-sinon',
      require.resolve('./')
    ],
    reporters: ['dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: process.env.TRAVIS ? ['Firefox'] : ['Chrome'],
    singleRun: true,
    concurrency: Infinity
  })
}
