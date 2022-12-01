/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts', // TODO: change to ts-jest once all repo is converted
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['src/**'],
  resetMocks: true,
  restoreMocks: true,
  setupFiles: ['<rootDir>/test/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/types/'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.json' }],
  },
};
