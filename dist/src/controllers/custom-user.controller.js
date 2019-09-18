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
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const context_1 = require("@loopback/context");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const authentication_1 = require("@loopback/authentication");
const bcrypt = require('bcrypt');
let CustomUserController = class CustomUserController {
    constructor(userRepository, user) {
        this.userRepository = userRepository;
        this.user = user;
    }
    async create(user) {
        user.password = bcrypt.hashSync(user.password, 10);
        return await this.userRepository.create(user);
    }
    async count(where) {
        return await this.userRepository.count(where);
    }
    async find(filter) {
        return await this.userRepository.find(filter);
    }
    async updateAll(user, where) {
        return await this.userRepository.updateAll(user, where);
    }
    async findById(id) {
        return await this.userRepository.find({ where: { id: id } });
    }
    async updateById(id, user) {
        await this.userRepository.updateById(id, user);
    }
    async deleteById(id) {
        await this.userRepository.deleteById(id);
    }
    async login(request, response) {
        return new Promise((resolve, reject) => {
            this.userRepository.find({ where: { email: request.body.email } }, function (err, userInstance) {
                if (userInstance.length > 0) {
                    bcrypt.compare(request.body.password, userInstance[0].password, function (err, match) {
                        if (match) {
                            resolve(userInstance[0]);
                        }
                        else {
                            let msg = {
                                error: {
                                    message: "login failed"
                                }
                            };
                            resolve(response.status(401).send(msg));
                        }
                    });
                }
                else {
                    let msg = { error: {
                            message: "login failed"
                        } };
                    resolve(response.status(401).send(msg));
                }
            });
        });
    }
    async logout(request, response) {
    }
};
__decorate([
    authentication_1.authenticate('BasicStrategy'),
    rest_1.post('/CustomUsers', {
        responses: {
            '200': {
                description: 'User model instance',
                content: { 'application/json': { schema: { 'x-ts-type': models_1.CustomUser } } },
            },
        },
    }),
    __param(0, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.CustomUser]),
    __metadata("design:returntype", Promise)
], CustomUserController.prototype, "create", null);
__decorate([
    rest_1.get('/CustomUsers/count', {
        responses: {
            '200': {
                description: 'User model count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    __param(0, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.CustomUser))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomUserController.prototype, "count", null);
__decorate([
    rest_1.get('/CustomUsers', {
        responses: {
            '200': {
                description: 'Array of User model instances',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: { 'x-ts-type': models_1.CustomUser } },
                    },
                },
            },
        },
    }),
    __param(0, rest_1.param.query.object('filter', rest_1.getFilterSchemaFor(models_1.CustomUser))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomUserController.prototype, "find", null);
__decorate([
    rest_1.patch('/CustomUsers', {
        responses: {
            '200': {
                description: 'User PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    __param(0, rest_1.requestBody()),
    __param(1, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.CustomUser))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.CustomUser, Object]),
    __metadata("design:returntype", Promise)
], CustomUserController.prototype, "updateAll", null);
__decorate([
    rest_1.get('/CustomUsers/{id}', {
        responses: {
            '200': {
                description: 'User model instance',
                content: { 'application/json': { schema: { 'x-ts-type': models_1.CustomUser } } },
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomUserController.prototype, "findById", null);
__decorate([
    rest_1.patch('/CustomUsers/{id}', {
        responses: {
            '204': {
                description: 'User PATCH success',
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __param(1, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, models_1.CustomUser]),
    __metadata("design:returntype", Promise)
], CustomUserController.prototype, "updateById", null);
__decorate([
    rest_1.del('/CustomUsers/{id}', {
        responses: {
            '204': {
                description: 'User DELETE success',
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomUserController.prototype, "deleteById", null);
__decorate([
    rest_1.post('CustomUsers/login', {
        responses: {
            '200': {
                description: 'User login success',
                content: { 'application/json': { schema: { 'x-ts-type': models_1.CustomUser } } },
            },
        },
    }),
    __param(0, rest_1.requestBody({})), __param(0, context_1.inject(rest_1.RestBindings.Http.REQUEST)), __param(1, context_1.inject(rest_1.RestBindings.Http.RESPONSE)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CustomUserController.prototype, "login", null);
__decorate([
    rest_1.post('/CustomUsers/logout', {
        responses: {
            '200': {
                description: 'User logout success',
                content: { 'application/json': { schema: { 'x-ts-type': {} } } },
            },
        },
    }),
    __param(0, rest_1.requestBody()), __param(0, context_1.inject(rest_1.RestBindings.Http.REQUEST)), __param(1, context_1.inject(rest_1.RestBindings.Http.RESPONSE)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CustomUserController.prototype, "logout", null);
CustomUserController = __decorate([
    __param(0, repository_1.repository(repositories_1.UserRepository)),
    __param(1, context_1.inject(authentication_1.AuthenticationBindings.CURRENT_USER, { optional: true })),
    __metadata("design:paramtypes", [repositories_1.UserRepository, Object])
], CustomUserController);
exports.CustomUserController = CustomUserController;
//# sourceMappingURL=custom-user.controller.js.map