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
const multer = require("multer");
const fs = require("fs");
let TemplateController = class TemplateController {
    constructor(templateRepository, user) {
        this.templateRepository = templateRepository;
        this.user = user;
    }
    // @authenticate('BasicStrategy')
    async upload(request, response) {
        return new Promise((resolve, reject) => {
            let self = this;
            var uploadedFileName = '';
            var originalFileName = '';
            var weblinkurl = '';
            var filetype = '';
            const container = 'templates';
            var dirPath = container;
            const storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    if (!fs.existsSync(dirPath)) {
                        var dir = fs.mkdirSync(dirPath);
                    }
                    cb(null, dirPath + '/');
                },
                filename: function (req, file, cb) {
                    var ext = file.originalname.substring(file.originalname.lastIndexOf("."));
                    var fileName = Date.now() + ext;
                    uploadedFileName = fileName;
                    originalFileName = file.originalname;
                    weblinkurl = `/${dirPath}/${uploadedFileName}`;
                    filetype = file.mimetype;
                    cb(null, fileName);
                }
            });
            var upload = multer({
                storage: storage
            }).single('file');
            upload(request, response, function (err) {
                if (err)
                    reject(err);
                else {
                    let createjson = {
                        id: Math.floor(1000 + Math.random() * 9000),
                        name: uploadedFileName,
                        originalFilename: originalFileName,
                    };
                    self.templateRepository.create(createjson);
                    resolve({
                        fileuploaded: uploadedFileName,
                        weblinkurl: weblinkurl
                    });
                }
            });
        });
    }
    async count(where) {
        return await this.templateRepository.count(where);
    }
    async find(filter) {
        return await this.templateRepository.find(filter);
    }
    /*@authenticate('BasicStrategy')
    @patch('/Templates', {
      responses: {
        '200': {
          description: 'Template PATCH success count',
          content: {'application/json': {schema: CountSchema}},
        },
      },
    })
    async updateAll(
      @requestBody() template: Template,
      @param.query.object('where', getWhereSchemaFor(Template)) where?: Where,
    ): Promise<Count> {
      return await this.templateRepository.updateAll(template, where);
    }*/
    async findById(id) {
        return await this.templateRepository.findById(id);
    }
};
__decorate([
    rest_1.post('/Templates', {
        responses: {
            '200': {
                description: 'Template model instance',
                content: { 'application/json': { schema: { 'x-ts-type': models_1.Template } } },
            },
        },
    }),
    __param(0, rest_1.requestBody({
        content: {
            'multipart/form-data': {
                'x-parser': 'stream',
                schema: {
                    type: 'object'
                },
            },
        },
    })), __param(1, context_1.inject(rest_1.RestBindings.Http.RESPONSE)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "upload", null);
__decorate([
    rest_1.get('/Templates/count', {
        responses: {
            '200': {
                description: 'Template model count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    __param(0, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Template))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "count", null);
__decorate([
    rest_1.get('/Templates', {
        responses: {
            '200': {
                description: 'Array of Template model instances',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: { 'x-ts-type': models_1.Template } },
                    },
                },
            },
        },
    }),
    __param(0, rest_1.param.query.object('filter', rest_1.getFilterSchemaFor(models_1.Template))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "find", null);
__decorate([
    rest_1.get('/Templates/{id}', {
        responses: {
            '200': {
                description: 'Template model instance',
                content: { 'application/json': { schema: { 'x-ts-type': models_1.Template } } },
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "findById", null);
TemplateController = __decorate([
    __param(0, repository_1.repository(repositories_1.TemplateRepository)),
    __param(1, context_1.inject(authentication_1.AuthenticationBindings.CURRENT_USER, { optional: true })),
    __metadata("design:paramtypes", [repositories_1.TemplateRepository, Object])
], TemplateController);
exports.TemplateController = TemplateController;
//# sourceMappingURL=template.controller.js.map