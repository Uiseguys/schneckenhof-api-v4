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
let SettingController = class SettingController {
    constructor(settingRepository, user) {
        this.settingRepository = settingRepository;
        this.user = user;
    }
    async upsertWithWhere(request, response, where) {
        let self = this;
        this.settingRepository.find({ where: { key: request.body.key } }, function (err, settingInstance) {
            if (settingInstance.length > 0) {
                self.settingRepository.updateAll(request.body, { key: request.body.key });
            }
            else {
                let createjson = {
                    id: Math.floor(1000 + Math.random() * 9000),
                    key: request.body.key,
                    value: request.body.value
                };
                self.settingRepository.create(createjson);
            }
        });
        //return await this.settingRepository.create(setting);
    }
    async count(where) {
        return await this.settingRepository.count(where);
    }
    async find(filter) {
        return await this.settingRepository.find(filter);
    }
    /*   @patch('/setting', {
        responses: {
          '200': {
            description: 'Setting PATCH success count',
            content: { 'application/json': { schema: CountSchema } },
          },
        },
      })
      async updateAll(
        @requestBody() setting: Setting,
        @param.query.object('where', getWhereSchemaFor(Setting)) where?: Where,
      ): Promise<Count> {
        return await this.settingRepository.updateAll(setting, where);
      } */
    /*   @get('/setting/{id}', {
        responses: {
          '200': {
            description: 'Setting model instance',
            content: { 'application/json': { schema: { 'x-ts-type': Setting } } },
          },
        },
      })
      async findById(@param.path.number('id') id: number): Promise<Setting> {
        return await this.settingRepository.findById(id);
      } */
    async updateById(id, setting) {
        await this.settingRepository.updateById(id, setting);
    }
    async upsertWithWheres(request, response, where) {
        let self = this;
        this.settingRepository.find({ where: { key: "netlifyHook" } }, function (err, settingInstance) {
            if (settingInstance.length > 0) {
                self.settingRepository.updateAll({ value: request.body }, { key: "netlifyHook" });
            }
            else {
                let createjson = {
                    id: Math.floor(1000 + Math.random() * 9000),
                    key: "netlifyHook",
                    value: request.body,
                };
                self.settingRepository.create(createjson);
            }
        });
        //return await this.settingRepository.create(setting);
    }
    async deleteById(id) {
        await this.settingRepository.deleteById(id);
    }
};
__decorate([
    authentication_1.authenticate('BasicStrategy'),
    rest_1.post('/Settings/upsertWithWhere', {
        responses: {
            '200': {
                description: 'Setting model instance',
                content: { 'application/json': { schema: { 'x-ts-type': models_1.Setting } } },
            },
        },
    }),
    __param(0, rest_1.requestBody({
        description: 'data',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        key: { type: 'string' },
                        value: {
                            type: 'object',
                        }
                    },
                },
            },
        },
    })), __param(0, context_1.inject(rest_1.RestBindings.Http.REQUEST)), __param(1, context_1.inject(rest_1.RestBindings.Http.RESPONSE)), __param(2, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Setting))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingController.prototype, "upsertWithWhere", null);
__decorate([
    rest_1.get('/Settings/count', {
        responses: {
            '200': {
                description: 'Setting model count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    __param(0, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Setting))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingController.prototype, "count", null);
__decorate([
    rest_1.get('/Settings', {
        responses: {
            '200': {
                description: 'Array of Setting model instances',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: { 'x-ts-type': models_1.Setting } },
                    },
                },
            },
        },
    }),
    __param(0, rest_1.param.query.object('filter', rest_1.getFilterSchemaFor(models_1.Setting))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingController.prototype, "find", null);
__decorate([
    authentication_1.authenticate('BasicStrategy'),
    rest_1.patch('/Settings/{id}', {
        responses: {
            '204': {
                description: 'Setting PATCH success',
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __param(1, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, models_1.Setting]),
    __metadata("design:returntype", Promise)
], SettingController.prototype, "updateById", null);
__decorate([
    rest_1.post('/Settings/netlify', {
        responses: {
            '200': {
                description: 'Setting model instance',
                content: { 'application/json': { schema: { 'x-ts-type': models_1.Setting } } },
            },
        },
    }),
    __param(0, rest_1.requestBody({
        description: 'data',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        key: { type: 'string' },
                        value: {
                            type: 'object',
                        }
                    },
                },
            },
        },
    })), __param(0, context_1.inject(rest_1.RestBindings.Http.REQUEST)), __param(1, context_1.inject(rest_1.RestBindings.Http.RESPONSE)), __param(2, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Setting))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingController.prototype, "upsertWithWheres", null);
__decorate([
    authentication_1.authenticate('BasicStrategy'),
    rest_1.del('/Settings/{id}', {
        responses: {
            '204': {
                description: 'Setting DELETE success',
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SettingController.prototype, "deleteById", null);
SettingController = __decorate([
    __param(0, repository_1.repository(repositories_1.SettingRepository)),
    __param(1, context_1.inject(authentication_1.AuthenticationBindings.CURRENT_USER, { optional: true })),
    __metadata("design:paramtypes", [repositories_1.SettingRepository, Object])
], SettingController);
exports.SettingController = SettingController;
//# sourceMappingURL=setting.controller.js.map