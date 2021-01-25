module.exports = (api) => ({
  presets: [
    [
      '@4c',
      {
        runtime: true,
        modules: api.env() === 'esm' ? false : 'commonjs',
        includePolyfills: 'usage-pure',
      },
    ],
  ],
  plugins: [api.env() !== 'esm' && 'add-module-exports'].filter(Boolean),
});
