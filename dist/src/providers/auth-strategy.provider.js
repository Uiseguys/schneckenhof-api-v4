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
const context_1 = require("@loopback/context");
const authentication_1 = require("@loopback/authentication");
const passport_http_1 = require("passport-http");
const repositories_1 = require("../repositories");
const repository_1 = require("@loopback/repository");
const bcrypt = require('bcrypt');
let MyAuthStrategyProvider = class MyAuthStrategyProvider {
    constructor(metadata, userRepository) {
        this.metadata = metadata;
        this.userRepository = userRepository;
    }
    value() {
        // The function was not decorated, so we shouldn't attempt authentication
        if (!this.metadata) {
            return undefined;
        }
        const name = this.metadata.strategy;
        if (name === 'BasicStrategy') {
            return new passport_http_1.BasicStrategy(this.verify.bind(this));
        }
        else {
            return Promise.reject(`The strategy ${name} is not available.`);
        }
    }
    verify(username, password, cb) {
        this.userRepository.findOne({ where: { email: username } }, function (err, user) {
            if (user) {
                bcrypt.compare(password, user.password, function (err, match) {
                    if (match) {
                        cb(null, { id: user.id });
                    }
                    else {
                        cb(null, false);
                    }
                });
            }
            else {
                cb(null, false);
            }
        });
    }
};
MyAuthStrategyProvider = __decorate([
    __param(0, context_1.inject(authentication_1.AuthenticationBindings.METADATA)),
    __param(1, repository_1.repository(repositories_1.UserRepository)),
    __metadata("design:paramtypes", [Object, repositories_1.UserRepository])
], MyAuthStrategyProvider);
exports.MyAuthStrategyProvider = MyAuthStrategyProvider;
//# sourceMappingURL=auth-strategy.provider.js.map