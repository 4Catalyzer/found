module.exports = {
  extends: ['4catalyzer-react', '4catalyzer-jest', 'prettier'],
  plugins: ['prettier', 'import'],
  parser: '@typescript-eslint/parser',
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
      },
    },
  },
  rules: {
    'react/prop-types': 'off',
    'prettier/prettier': 'error',
    'no-use-before-define': 'off',
  },
};
