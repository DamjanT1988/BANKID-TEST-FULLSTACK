"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.i18nConfig = void 0;
const nestjs_i18n_1 = require("nestjs-i18n");
const path = require("path");
exports.i18nConfig = nestjs_i18n_1.I18nModule.forRoot({
    fallbackLanguage: 'sv',
    loaderOptions: {
        path: path.join(__dirname, '/../../i18n/'),
        watch: true,
    },
    resolvers: [new nestjs_i18n_1.QueryResolver(['lang']), new nestjs_i18n_1.AcceptLanguageResolver()],
});
//# sourceMappingURL=config.js.map