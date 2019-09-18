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
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let LogsController = class LogsController {
    constructor(logsRepository) {
        this.logsRepository = logsRepository;
    }
    async create(logs) {
        return await this.logsRepository.create(logs);
    }
    async count(where) {
        return await this.logsRepository.count(where);
    }
    async find(filter) {
        return await this.logsRepository.find(filter);
    }
    async updateAll(logs, where) {
        return await this.logsRepository.updateAll(logs, where);
    }
    async findById(id) {
        return await this.logsRepository.findById(id);
    }
    async updateById(id, logs) {
        await this.logsRepository.updateById(id, logs);
    }
    async deleteById(id) {
        await this.logsRepository.deleteById(id);
    }
};
__decorate([
    rest_1.post('/logs', {
        responses: {
            '200': {
                description: 'Logs model instance',
                content: { 'application/json': { schema: { 'x-ts-type': models_1.Logs } } },
            },
        },
    }),
    __param(0, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.Logs]),
    __metadata("design:returntype", Promise)
], LogsController.prototype, "create", null);
__decorate([
    rest_1.get('/logs/count', {
        responses: {
            '200': {
                description: 'Logs model count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    __param(0, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Logs))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LogsController.prototype, "count", null);
__decorate([
    rest_1.get('/logs', {
        responses: {
            '200': {
                description: 'Array of Logs model instances',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: { 'x-ts-type': models_1.Logs } },
                    },
                },
            },
        },
    }),
    __param(0, rest_1.param.query.object('filter', rest_1.getFilterSchemaFor(models_1.Logs))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LogsController.prototype, "find", null);
__decorate([
    rest_1.patch('/logs', {
        responses: {
            '200': {
                description: 'Logs PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    __param(0, rest_1.requestBody()),
    __param(1, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Logs))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.Logs, Object]),
    __metadata("design:returntype", Promise)
], LogsController.prototype, "updateAll", null);
__decorate([
    rest_1.get('/logs/{id}', {
        responses: {
            '200': {
                description: 'Logs model instance',
                content: { 'application/json': { schema: { 'x-ts-type': models_1.Logs } } },
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LogsController.prototype, "findById", null);
__decorate([
    rest_1.patch('/logs/{id}', {
        responses: {
            '204': {
                description: 'Logs PATCH success',
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __param(1, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, models_1.Logs]),
    __metadata("design:returntype", Promise)
], LogsController.prototype, "updateById", null);
__decorate([
    rest_1.del('/logs/{id}', {
        responses: {
            '204': {
                description: 'Logs DELETE success',
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LogsController.prototype, "deleteById", null);
LogsController = __decorate([
    __param(0, repository_1.repository(repositories_1.LogsRepository)),
    __metadata("design:paramtypes", [repositories_1.LogsRepository])
], LogsController);
exports.LogsController = LogsController;
//# sourceMappingURL=logs.controller.js.map