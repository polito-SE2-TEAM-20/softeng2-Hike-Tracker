const { pathsToModuleNameMapper } = require('ts-jest');

const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  verbose: true,
  maxConcurrency: 1,
  testTimeout: 1000 * 20,
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  roots: ['<rootDir>/test', '<rootDir>/libs'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  setupFiles: ['dotenv/config'],
  reporters: ['default', 'jest-junit'],
  setupFilesAfterEnv: ['jest-extended/all'],
  forceExit: true,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
};
