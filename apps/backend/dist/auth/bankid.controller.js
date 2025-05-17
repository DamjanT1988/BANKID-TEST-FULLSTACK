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
exports.BankIdController = void 0;
const common_1 = require("@nestjs/common");
const bankid_service_1 = require("./bankid.service");
const zod_1 = require("zod");
const InitiateDto = zod_1.z.object({ personNumber: zod_1.z.string() });
let BankIdController = class BankIdController {
    constructor(svc) {
        this.svc = svc;
    }
    async login(body) {
        const { personNumber } = InitiateDto.parse(body);
        const orderRef = await this.svc.initiate(personNumber);
        return { orderRef };
    }
    async status(orderRef) {
        return await this.svc.status(orderRef);
    }
    async cancel(orderRef) {
        await this.svc.cancel(orderRef);
        return { cancelled: true };
    }
};
exports.BankIdController = BankIdController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BankIdController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('status/:orderRef'),
    __param(0, (0, common_1.Param)('orderRef')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BankIdController.prototype, "status", null);
__decorate([
    (0, common_1.Post)('cancel/:orderRef'),
    __param(0, (0, common_1.Param)('orderRef')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BankIdController.prototype, "cancel", null);
exports.BankIdController = BankIdController = __decorate([
    (0, common_1.Controller)('api/auth'),
    __metadata("design:paramtypes", [bankid_service_1.BankIdService])
], BankIdController);
//# sourceMappingURL=bankid.controller.js.map