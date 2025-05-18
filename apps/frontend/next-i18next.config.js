// apps/frontend/next-i18next.config.js
const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'sv',
    locales: ['sv', 'en'],
  },
localePath: require('path').resolve('./public/locales')
};
