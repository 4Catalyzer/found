module.exports = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['src/**'],
  resetMocks: true,
  restoreMocks: true,
  setupFiles: ['<rootDir>/test/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/types/'],
};
