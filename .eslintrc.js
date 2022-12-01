module.exports = {
  extends: [
    '4catalyzer-react',
    '4catalyzer-jest',
    '4catalyzer-typescript',
    'prettier',
  ],
  plugins: ['prettier', 'import'],
  rules: {
    'react/prop-types': 'off',
    'prettier/prettier': 'error',
    'no-use-before-define': 'off',
  },
};
