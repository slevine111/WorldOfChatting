module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  globalSetup: './jest-global-setup.ts',
  globalTeardown: './jest-global-teardown.ts'
}
