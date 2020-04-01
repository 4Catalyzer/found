module.exports = (api) => ({
  presets: [
    [
      '@4c',
      {
        runtime: true,
        corejs: 3,
        targets: {},
        modules: api.env() === 'esm' ? false : 'commonjs',
      },
    ],
  ],
  plugins: [api.env() !== 'esm' && 'add-module-exports'].filter(Boolean),
});
