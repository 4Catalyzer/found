module.exports = {
  presets: [
    [
      '@babel/env',
      {
        loose: true,
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
    '@babel/react',
  ],
  plugins: ['react-hot-loader/babel'],
};
