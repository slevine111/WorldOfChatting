const path = require('path')

module.exports = {
  collectCoverage: true,
  coverageReporters: ['html'],
  coverageDirectory: path.join(__dirname, 'test-coverage-results'),
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.spec.ts'],
  setupFiles: ['dotenv/config'],
  globalSetup: './jest-global-setup.ts',
  globalTeardown: './jest-global-teardown.ts'
}
