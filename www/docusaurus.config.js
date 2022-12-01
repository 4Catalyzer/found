/* eslint-disable global-require */
// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const lightCodeTheme = require('prism-react-renderer/themes/github');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'found',
  tagline: 'Extensible route-based routing for React applications.',
  url: 'https://4Catalyzer.github.io/',
  baseUrl: '/found/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/f-logo-empty.svg',
  organizationName: '4Catalyzer', // Usually your GitHub org/user name.
  projectName: 'found', // Usually your repo name.

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid', 'docusaurus-theme-jarle-codeblock'],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/4Catalyzer/found/edit/master/www',
          // routeBasePath: '/',
          remarkPlugins: [require('docusaurus-theme-jarle-codeblock/remark')],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Found',
        logo: {
          alt: 'Found Logo',
          src: 'img/f-logo-empty.svg',
        },
        items: [
          {
            docId: '/category/getting-started',
            label: 'Docs',
            type: 'doc',
            position: 'left',
          },

          {
            href: 'https://github.com/4Catalyzer/found',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            href: 'https://github.com/4Catalyzer/found',
            label: 'GitHub',
          },
          {
            href: 'https://github.com/4Catalyzer/found',
            label: 'Issues',
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} <a href="https://github.com/4Catalyzer">4Catalyzer</a>.  MIT License. Built with Docusaurus. Logo by <a href="https://www.github.com/golota60">Szymon Wiszczuk</a>.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
