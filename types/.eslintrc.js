module.exports = {
  extends: ['4catalyzer-typescript'],
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
