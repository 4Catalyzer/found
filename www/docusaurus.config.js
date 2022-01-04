// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const lightCodeTheme = require('prism-react-renderer/themes/github');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'found',
  tagline: 'Extensible route-based routing for React applications.',
  url: 'https://4Catalyzer.github.io/found/',
  baseUrl: '/found/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/f-logo-empty.svg',
  organizationName: '4Catalyzer', // Usually your GitHub org/user name.
  projectName: 'found', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@4c/docusaurus-preset').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/4Catalyzer/found/edit/master',
          routeBasePath: '/',
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
