module.exports = {
  title: 'BankID Implementation',
  url: 'http://localhost',
  baseUrl: '/',
  plugins: [
    [
      'docusaurus-plugin-redoc',
      {
        id: 'bankid-api',
        specs: [
          {
            spec: 'docs/api/openapi.yaml',  // path to your spec
            route: '/api/',                  // URL base for the docs
          },
        ],
        theme: {
          // optional: tweak Redoc’s look
          primaryColor: '#0052cc',
        },
      },
    ],
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
        },
      },
    ],
  ],
};
