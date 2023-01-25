module.exports = {
  extends: ['4catalyzer-typescript'],
  rules: {
    'react/no-unused-prop-types': 'off',
    'no-restricted-exports': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
