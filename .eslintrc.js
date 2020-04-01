module.exports = {
  extends: [
    '4catalyzer-react',
    '4catalyzer-jest',
    'prettier',
    'prettier/react',
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
