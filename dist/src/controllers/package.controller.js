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
let PackageController = class PackageController {
    constructor(packageRepository, user) {
        this.packageRepository = packageRepository;
        this.user = user;
    }
    async create(packages) {
        packages.id = Math.floor(1000 + Math.random() * 9000);
        return await this.packageRepository.create(packages);
    }
    async count(where) {
        return await this.packageRepository.count(where);
    }
    async find(filter) {
        return await this.packageRepository.find(filter);
    }
    // @authenticate('BasicStrategy')
    // @patch('/Packagings', {
    //   responses: {
    //     '200': {
    //       description: 'Package PATCH success count',
    //       content: { 'application/json': { schema: CountSchema } },
    //     },
    //   },
    // })
    // async updateAll(
    //   @requestBody() packages: Package,
    //   @param.query.object('where', getWhereSchemaFor(Package)) where?: Where,
    // ): Promise<Count> {
    //   return await this.packageRepository.updateAll(packages, where);
    // }
    async findById(id) {
        return await this.packageRepository.findById(id);
    }
    async updateById(id, packages) {
        await this.packageRepository.updateById(id, packages);
    }
    async deleteById(id) {
        await this.packageRepository.deleteById(id);
    }
};
__decorate([
    authentication_1.authenticate('BasicStrategy'),
    rest_1.post('/Packagings', {
        responses: {
            '200': {
                description: 'Package model instance',
                content: { 'application/json': { schema: { 'x-ts-type': models_1.Package } } },
            },
        },
    }),
    __param(0, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.Package]),
    __metadata("design:returntype", Promise)
], PackageController.prototype, "create", null);
__decorate([
    rest_1.get('/Packagings/count', {
        responses: {
            '200': {
                description: 'Package model count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    __param(0, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Package))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PackageController.prototype, "count", null);
__decorate([
    rest_1.get('/Packagings', {
        responses: {
            '200': {
                description: 'Array of Package model instances',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: { 'x-ts-type': models_1.Package } },
                    },
                },
            },
        },
    }),
    __param(0, rest_1.param.query.object('filter', rest_1.getFilterSchemaFor(models_1.Package))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PackageController.prototype, "find", null);
__decorate([
    rest_1.get('/Packagings/{id}', {
        responses: {
            '200': {
                description: 'Package model instance',
                content: { 'application/json': { schema: { 'x-ts-type': models_1.Package } } },
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PackageController.prototype, "findById", null);
__decorate([
    authentication_1.authenticate('BasicStrategy'),
    rest_1.patch('/Packagings/{id}', {
        responses: {
            '204': {
                description: 'Package PATCH success',
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __param(1, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, models_1.Package]),
    __metadata("design:returntype", Promise)
], PackageController.prototype, "updateById", null);
__decorate([
    authentication_1.authenticate('BasicStrategy'),
    rest_1.del('/Packagings/{id}', {
        responses: {
            '204': {
                description: 'Package DELETE success',
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PackageController.prototype, "deleteById", null);
PackageController = __decorate([
    __param(0, repository_1.repository(repositories_1.PackageRepository)),
    __param(1, context_1.inject(authentication_1.AuthenticationBindings.CURRENT_USER, { optional: true })),
    __metadata("design:paramtypes", [repositories_1.PackageRepository, Object])
], PackageController);
exports.PackageController = PackageController;
//# sourceMappingURL=package.controller.js.map