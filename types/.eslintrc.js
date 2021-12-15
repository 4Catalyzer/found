module.exports = {
  extends: ['4catalyzer-typescript'],
  rules: {
    'no-restricted-exports': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
