// docusaurus.config.js

module.exports = {
  title: 'BankID V5',
  tagline: 'Authentication API Documentation',
  url: 'https://your-domain.com',            // Your website URL
  baseUrl: '/',                              // Base URL for your project
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'your-org',              // GitHub org/user name
  projectName: 'bankid-docs',                // Repo name

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/your-org/bankid-docs/edit/main/', // Optional: link to edit pages
        },
        blog: false,    // Disable the blog plugin if you don't need it
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
    [
      'redocusaurus',
      {
        specs: [
          {
            spec: 'docs/api/openapi.yaml',  // Path to your OpenAPI spec
            route: '/api',                   // URL route for the rendered docs
          },
        ],
        theme: {
          primaryColor: '#0052cc',         // Optional: override Redoc primary color
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'BankID V5',
      logo: {
        alt: 'BankID Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/api',
          label: 'API Reference',
          position: 'left',
        },
        {
          href: 'https://github.com/your-org/bankid-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
            {
              label: 'API Reference',
              to: '/api',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/your-org/bankid-docs/discussions',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/your-org/bankid-docs',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Your Organization`,
    },
  },
};
