let exportObject = {
  collectCoverage: true,
  coverageReporters: ['html'],
  reporters: ['default', 'jest-junit'],
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.spec.ts'],
  globalSetup: './jest-global-setup.ts'
}

if (process.env.LOAD_CONFIG_FILE === 'true') {
  exportObject.setupFiles = ['dotenv/config']
}

module.exports = exportObject
