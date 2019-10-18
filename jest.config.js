module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests-fake/**/*.spec.ts'],
  setupFiles: ['dotenv/config'],
  globalSetup: './jest-global-setup.ts',
  globalTeardown: './jest-global-teardown.ts'
}
