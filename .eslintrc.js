module.exports = {
  extends: ['4catalyzer-react', '4catalyzer-jest', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    requireConfigFile: false,
  },
  rules: {
    'prettier/prettier': 'error',
  },
};
