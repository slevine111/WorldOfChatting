module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  globalSetup: './jest-global-setup.ts',
  globalTeardown: './jest-global-teardown.ts' //,
  /*globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true
      },
      tsConfig: {
        noUnusedLocals: false
      }
    }
  }*/
}
