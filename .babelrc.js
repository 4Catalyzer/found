module.exports = (api) => ({
  presets: [
    [
      '@4c',
      {
        runtime: true,
        modules: api.env() === 'esm' ? false : 'commonjs',
        includePolyfills: 'usage-pure',
        debug: true,
      },
    ],
  ],
  plugins: [api.env() !== 'esm' && 'add-module-exports'].filter(Boolean),
});
