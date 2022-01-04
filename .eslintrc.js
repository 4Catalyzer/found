module.exports = {
  extends: ['4catalyzer-react', '4catalyzer-jest', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    requireConfigFile: false,
  },
  rules: {
    'react/prop-types': 'off',
    'prettier/prettier': 'error',
  },
};
