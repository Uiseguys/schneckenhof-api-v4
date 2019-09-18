"use strict";
// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("@loopback/repository");
let CustomUser = class CustomUser extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
__decorate([
    repository_1.property({
        type: 'object',
        default: {},
    }),
    __metadata("design:type", Object)
], CustomUser.prototype, "settings", void 0);
__decorate([
    repository_1.property({
        type: 'number',
        id: true,
        required: true,
        default: 0
    }),
    __metadata("design:type", Number)
], CustomUser.prototype, "id", void 0);
__decorate([
    repository_1.property({
        type: 'string',
    }),
    __metadata("design:type", String)
], CustomUser.prototype, "realm", void 0);
__decorate([
    repository_1.property({
        type: 'string',
        id: true,
        required: true,
    }),
    __metadata("design:type", String)
], CustomUser.prototype, "username", void 0);
__decorate([
    repository_1.property({
        type: 'string',
        required: true,
    }),
    __metadata("design:type", String)
], CustomUser.prototype, "password", void 0);
__decorate([
    repository_1.property({
        type: 'string',
        required: true,
    }),
    __metadata("design:type", String)
], CustomUser.prototype, "email", void 0);
__decorate([
    repository_1.property({
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], CustomUser.prototype, "emailVerified", void 0);
__decorate([
    repository_1.property({
        type: 'string',
        default: null,
    }),
    __metadata("design:type", String)
], CustomUser.prototype, "verificationToken", void 0);
CustomUser = __decorate([
    repository_1.model(),
    __metadata("design:paramtypes", [Object])
], CustomUser);
exports.CustomUser = CustomUser;
//# sourceMappingURL=user.model.js.map