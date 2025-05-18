const { i18n } = require('./next-i18next.config');

module.exports = {
  reactStrictMode: true,
  i18n: {
    locales: ['sv', 'en'],
    defaultLocale: 'sv',
  },
};
