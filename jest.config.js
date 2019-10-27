let exportObject = {
  collectCoverage: true,
  coverageReporters: ['html'],
  reporters: ['default', 'jest-junit'],
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.spec.ts'],
  globalSetup: './jest-global-setup.ts',
  globalTeardown: './jest-global-teardown.ts'
}

if (process.env.CI_BUILD === 'false') {
  exportObject.setupFiles = ['dotenv/config']
}

module.exports = exportObject
