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
const repositories_2 = require("../repositories");
const authentication_1 = require("@loopback/authentication");
let WineController = class WineController {
    constructor(wineRepository, packageRepository, user) {
        this.wineRepository = wineRepository;
        this.packageRepository = packageRepository;
        this.user = user;
    }
    async create(wine, request, response) {
        wine.id = Math.floor(1000 + Math.random() * 9000);
        return await this.wineRepository.create(wine);
    }
    async count(where) {
        return await this.wineRepository.count(where);
    }
    async find(filter) {
        let self = this;
        let packagingData = [];
        return new Promise((resolve, reject) => {
            this.wineRepository.find(filter, function (err, wine) {
                if (err) {
                    reject(err);
                }
                else {
                    self.packageRepository.find({}, function (err, packaging) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            packagingData = packaging;
                            for (let i = 0; i < wine.length; i++) {
                                let index = packagingData.findIndex((x) => x.id == wine[i].packagingId);
                                if (index > -1) {
                                    wine[i]['packaging'] = packagingData[index];
                                }
                            }
                            resolve(wine);
                        }
                    });
                }
            });
        });
        /*this.wineRepository.find(filter,function(err:any,wine:any){
         let winedata:any = {};
         if(wine.length>0){
             for(let i=0; i<wine.length; i++){
                self.packageRepository.find({where: {id: wine[i].packagingId}},function(err:any, packaging:any){
                     //console.log(packaging);
                     wine[i]["packaging"] = packaging[0];
                     console.log(wine[i]);
                })
             }
          }
        });
        return await this.wineRepository.find(filter);*/
    }
    async updateAll(wine, where) {
        return await this.wineRepository.updateAll(wine, where);
    }
    async findById(id) {
        return await this.wineRepository.findById(id);
    }
    async updateById(id, wine) {
        await this.wineRepository.updateById(id, wine);
    }
    async deleteById(id) {
        await this.wineRepository.deleteById(id);
    }
};
__decorate([
    authentication_1.authenticate('BasicStrategy'),
    rest_1.post('/Wines', {
        responses: {
            '200': {
                description: 'Wine model instance',
                content: { 'application/json': { schema: { 'x-ts-type': models_1.Wine } } },
            },
        },
    }),
    __param(0, rest_1.requestBody()), __param(1, context_1.inject(rest_1.RestBindings.Http.REQUEST)), __param(2, context_1.inject(rest_1.RestBindings.Http.RESPONSE)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.Wine, Object, Object]),
    __metadata("design:returntype", Promise)
], WineController.prototype, "create", null);
__decorate([
    authentication_1.authenticate('BasicStrategy'),
    rest_1.get('/Wines/count', {
        responses: {
            '200': {
                description: 'Wine model count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    __param(0, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Wine))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WineController.prototype, "count", null);
__decorate([
    rest_1.get('/Wines', {
        responses: {
            '200': {
                description: 'Array of Wine model instances',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: { 'x-ts-type': models_1.Wine } },
                    },
                },
            },
        },
    }),
    __param(0, rest_1.param.query.object('filter', rest_1.getFilterSchemaFor(models_1.Wine))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WineController.prototype, "find", null);
__decorate([
    rest_1.patch('/Wines', {
        responses: {
            '200': {
                description: 'Wine PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    __param(0, rest_1.requestBody()),
    __param(1, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Wine))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.Wine, Object]),
    __metadata("design:returntype", Promise)
], WineController.prototype, "updateAll", null);
__decorate([
    rest_1.get('/Wines/{id}', {
        responses: {
            '200': {
                description: 'Wine model instance',
                content: { 'application/json': { schema: { 'x-ts-type': models_1.Wine } } },
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WineController.prototype, "findById", null);
__decorate([
    authentication_1.authenticate('BasicStrategy'),
    rest_1.patch('/Wines/{id}', {
        responses: {
            '204': {
                description: 'Wine PATCH success',
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __param(1, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, models_1.Wine]),
    __metadata("design:returntype", Promise)
], WineController.prototype, "updateById", null);
__decorate([
    authentication_1.authenticate('BasicStrategy'),
    rest_1.del('/Wines/{id}', {
        responses: {
            '204': {
                description: 'Wine DELETE success',
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WineController.prototype, "deleteById", null);
WineController = __decorate([
    __param(0, repository_1.repository(repositories_1.WineRepository)),
    __param(1, repository_1.repository(repositories_2.PackageRepository)),
    __param(2, context_1.inject(authentication_1.AuthenticationBindings.CURRENT_USER, { optional: true })),
    __metadata("design:paramtypes", [repositories_1.WineRepository,
        repositories_2.PackageRepository, Object])
], WineController);
exports.WineController = WineController;
//# sourceMappingURL=wine.controller.js.map