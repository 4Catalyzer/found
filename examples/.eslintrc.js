module.exports = {
  env: {
    browser: true,
  },
  rules: {
    // Don't fail linting if example dependencies aren't installed.
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
  },
};
