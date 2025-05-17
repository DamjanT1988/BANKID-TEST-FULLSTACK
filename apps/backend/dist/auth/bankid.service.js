"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankIdService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const uuid_1 = require("uuid");
const user_service_1 = require("../user/user.service");
let BankIdService = class BankIdService {
    constructor(redis, userService) {
        this.redis = redis;
        this.userService = userService;
    }
    async initiate(personNumber) {
        const orderRef = (0, uuid_1.v4)();
        await this.redis.set(orderRef, personNumber, 'EX', 300);
        return orderRef;
    }
    async status(orderRef) {
        const personNumber = await this.redis.get(orderRef);
        if (!personNumber)
            return { status: 'failed' };
        return { status: 'pending' };
    }
    async cancel(orderRef) {
        await this.redis.del(orderRef);
        return;
    }
};
exports.BankIdService = BankIdService;
exports.BankIdService = BankIdService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('REDIS')),
    __metadata("design:paramtypes", [ioredis_1.default,
        user_service_1.UserService])
], BankIdService);
//# sourceMappingURL=bankid.service.js.map