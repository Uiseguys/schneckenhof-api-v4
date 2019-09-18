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
let NewsControllerController = class NewsControllerController {
    constructor(newsRepository, user) {
        this.newsRepository = newsRepository;
        this.user = user;
    }
    async create(news) {
        news.id = Math.floor(1000 + Math.random() * 9000);
        return await this.newsRepository.create(news);
    }
    async count(where) {
        return await this.newsRepository.count(where);
    }
    async find(filter) {
        return await this.newsRepository.find(filter);
    }
    async updateAll(news, where) {
        return await this.newsRepository.updateAll(news, where);
    }
    async findById(id) {
        return await this.newsRepository.findById(id);
    }
    async updateById(id, news) {
        await this.newsRepository.updateById(id, news);
    }
    async deleteById(id) {
        await this.newsRepository.deleteById(id);
    }
};
__decorate([
    authentication_1.authenticate('BasicStrategy'),
    rest_1.post('/News', {
        responses: {
            '200': {
                description: 'News model instance',
                content: { 'application/json': { schema: { 'x-ts-type': models_1.News } } },
            },
        },
    }),
    __param(0, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.News]),
    __metadata("design:returntype", Promise)
], NewsControllerController.prototype, "create", null);
__decorate([
    rest_1.get('/News/count', {
        responses: {
            '200': {
                description: 'News model count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    __param(0, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.News))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NewsControllerController.prototype, "count", null);
__decorate([
    rest_1.get('/News', {
        responses: {
            '200': {
                description: 'Array of News model instances',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: { 'x-ts-type': models_1.News } },
                    },
                },
            },
        },
    }),
    __param(0, rest_1.param.query.object('filter', rest_1.getFilterSchemaFor(models_1.News))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NewsControllerController.prototype, "find", null);
__decorate([
    authentication_1.authenticate('BasicStrategy'),
    rest_1.patch('/News', {
        responses: {
            '200': {
                description: 'News PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    __param(0, rest_1.requestBody()),
    __param(1, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.News))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.News, Object]),
    __metadata("design:returntype", Promise)
], NewsControllerController.prototype, "updateAll", null);
__decorate([
    rest_1.get('/News/{id}', {
        responses: {
            '200': {
                description: 'News model instance',
                content: { 'application/json': { schema: { 'x-ts-type': models_1.News } } },
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NewsControllerController.prototype, "findById", null);
__decorate([
    authentication_1.authenticate('BasicStrategy'),
    rest_1.patch('/News/{id}', {
        responses: {
            '204': {
                description: 'News PATCH success',
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __param(1, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, models_1.News]),
    __metadata("design:returntype", Promise)
], NewsControllerController.prototype, "updateById", null);
__decorate([
    authentication_1.authenticate('BasicStrategy'),
    rest_1.del('/News/{id}', {
        responses: {
            '204': {
                description: 'News DELETE success',
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NewsControllerController.prototype, "deleteById", null);
NewsControllerController = __decorate([
    __param(0, repository_1.repository(repositories_1.NewsRepository)),
    __param(1, context_1.inject(authentication_1.AuthenticationBindings.CURRENT_USER, { optional: true })),
    __metadata("design:paramtypes", [repositories_1.NewsRepository, Object])
], NewsControllerController);
exports.NewsControllerController = NewsControllerController;
//# sourceMappingURL=news-controller.controller.js.map