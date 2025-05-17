"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankIdModule = void 0;
const common_1 = require("@nestjs/common");
const bankid_service_1 = require("./bankid.service");
const bankid_controller_1 = require("./bankid.controller");
const user_module_1 = require("../user/user.module");
const ioredis_1 = require("ioredis");
let BankIdModule = class BankIdModule {
};
exports.BankIdModule = BankIdModule;
exports.BankIdModule = BankIdModule = __decorate([
    (0, common_1.Module)({
        imports: [user_module_1.UserModule],
        controllers: [bankid_controller_1.BankIdController],
        providers: [
            bankid_service_1.BankIdService,
            {
                provide: 'REDIS',
                useFactory: () => new ioredis_1.default(process.env.REDIS_URL),
            },
        ],
    })
], BankIdModule);
//# sourceMappingURL=auth.module.js.map