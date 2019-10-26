const path = require('path')

module.exports = {
  collectCoverage: true,
  coverageReporters: ['html'],
  coverageDirectory: path.join(
    __dirname,
    `coverage${process.env.CI_BUILD === 'true' ? '-circleci' : ''}`
  ),
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.spec.ts'],
  setupFiles: ['dotenv/config'],
  globalSetup: './jest-global-setup.ts',
  globalTeardown: './jest-global-teardown.ts'
}
