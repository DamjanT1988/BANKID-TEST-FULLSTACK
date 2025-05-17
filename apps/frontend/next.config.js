/** @type {import('next').NextConfig} */
module.exports = {
  i18n: {
    locales: ['sv', 'en'],
    defaultLocale: 'sv',
    
  },

  webpack(config) {
    config.resolve.alias['@dto'] = path.resolve(__dirname, '../../packages/dto');
    return config;
  }
};
