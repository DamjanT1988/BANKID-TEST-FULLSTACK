import { Module } from '@nestjs/common';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import * as path from 'path';

export const i18nConfig = I18nModule.forRoot({
  fallbackLanguage: 'sv',
  loaderOptions: {
    path: path.join(__dirname, '/../../src/i18n/'),
    watch: true,
  },
  resolvers: [new QueryResolver(['lang']), new AcceptLanguageResolver()],
});
