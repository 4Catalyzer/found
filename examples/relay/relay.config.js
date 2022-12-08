module.exports = {
  src: './src',
  language: 'typescript',
  eagerEsModules: true,
  schema: './node_modules/swapi-graphql-mock-api/schema.graphql',
  exclude: ['**/node_modules/**', '**/__mocks__/**', '**/__generated__/**'],
};
