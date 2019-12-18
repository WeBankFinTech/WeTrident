// const path = require('path')
module.exports = {
  // notify: true,
  verbose: true,
  // Since axios has both xhr and node network adapter,
  // xhr adapter has cross domain problem when use jest test framework, change this to node to avoid the cross domain problem
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.test.js'
  ],
  setupFilesAfterEnv: ['./__tests__/jest.setup.js']
}
