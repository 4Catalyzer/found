module.exports = {
  extends: ['4catalyzer-react', '4catalyzer-jest', 'prettier'],
  plugins: ['prettier', 'import'],
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    'react/prop-types': 'off',
    'prettier/prettier': 'error',
    'no-use-before-define': 'off',
  },
};
