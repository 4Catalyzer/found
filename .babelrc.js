module.exports = (api) => ({
  presets: [
    [
      '@4c',
      {
        runtime: true,
        modules: api.env() === 'esm' ? false : 'commonjs',
        includePolyfills: false,
      },
    ],
  ],
  plugins: [
    ['transform-react-remove-prop-types', { mode: 'wrap' }],
    api.env() !== 'esm' && 'add-module-exports',
  ].filter(Boolean),
});
