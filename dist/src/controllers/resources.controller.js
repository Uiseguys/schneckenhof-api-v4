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
const config = require("../datasources/db.datasource.json");
const authentication_1 = require("@loopback/authentication");
let ResourcesController = class ResourcesController {
    constructor(resourceRepository, user) {
        this.resourceRepository = resourceRepository;
        this.user = user;
    }
    /*@post('/Resources', {
      responses: {
        '200': {
          description: 'Resource model instance',
          content: { 'application/json': { schema: { 'x-ts-type': Resource } } },
        },
      },
    })
    async create(@requestBody() resource: Resource,@inject(RestBindings.Http.RESPONSE) response: Response,): Promise<Resource> {
  
      return await this.resourceRepository.create(resource);
    }*/
    // @authenticate('BasicStrategy')
    /*async upload(
      @requestBody({
        description: 'multipart/form-data value.',
        required: true,
        content: {
          'multipart/form-data': {
            'x-parser': 'stream',
            schema: {type: 'object'},
          },
        },
      })
      request: Request,
      response: Response
    ): Promise<object> {
      const storage = multer.memoryStorage();
      const upload = multer({storage});
      console.log(request);
      return new Promise<object>((resolve, reject) => {
       
      });
    }*/
    async create(request, response) {
        return new Promise((resolve, reject) => {
            let self = this;
            var uploadedFileName = '';
            var originalFileName = '';
            var weblinkurl = '';
            var filetype = '';
            const container = config.storage.container || 'schneckenhof';
            var dirPath = container;
            const { Storage } = require('@google-cloud/storage');
            // Your Google Cloud Platform project ID
            const projectId = '945516150699';
            // Creates a client
            const google_storage = new Storage({
                projectId: projectId,
                keyFilename: './weingut-schneckenhof-a8e85ce5a0ba.json'
            });
            // The name for the new bucket
            const bucketName = 'schneckenhof-dev';
            const bucket = google_storage.bucket('schneckenhof-dev');
            bucket.acl.default.add({
                entity: 'allUsers',
                role: google_storage.acl.READER_ROLE
            }, function (err) { });
            // Creates the new bucket
            // storage
            //   .createBucket(bucketName)
            //   .then(() => {
            //     console.log(`Bucket ${bucketName} created.`);
            //   })
            //   .catch((err:any) => {
            //     console.error('ERROR:', err);
            //   });
            const multiparty = require('multiparty');
            const form = new multiparty.Form();
            form.parse(request, (err, fields, files) => {
                if (err)
                    reject(err);
                const file = files['file'][0]; // get the file from the returned files object
                if (!file)
                    reject('File was not found in form data.');
                else {
                    var ext = file.originalFilename.substring(file.originalFilename.lastIndexOf("."));
                    var fileName = Date.now() + ext;
                    uploadedFileName = fileName;
                    originalFileName = file.originalFilename;
                    filetype = file.headers['content-type'];
                    bucket.upload(file.path, function (err, file) {
                        if (err)
                            reject(err);
                        else {
                            weblinkurl = `/${dirPath}/${uploadedFileName}`;
                            let createjson = {
                                id: Math.floor(1000 + Math.random() * 9000),
                                resourceId: uploadedFileName,
                                weblinkUrl: file.metadata.mediaLink,
                                originalFilename: originalFileName,
                                type: filetype
                            };
                            console.log(createjson);
                            self.resourceRepository.create(createjson);
                            resolve({
                                fileuploaded: uploadedFileName,
                                weblinkurl: weblinkurl
                            });
                        }
                    });
                }
            });
        });
    }
    /*@post('/Resources/{container}/download/{name}', {
      responses: {
        '200': {
          description: 'Resource model upload instance',
          content: { 'application/json': { schema: { 'x-ts-type': Resource } } },
        },
      },
    })
    async download(@requestBody() resource: Resource): Promise<Resource> {
      return await this.resourceRepository.create(resource);
    }*/
    async count(where) {
        return await this.resourceRepository.count(where);
    }
    async find(filter) {
        return await this.resourceRepository.find(filter);
    }
    /*   @patch('/resources', {
        responses: {
          '200': {
            description: 'Resource PATCH success count',
            content: {'application/json': {schema: CountSchema}},
          },
        },
      })
      async updateAll(
        @requestBody() resource: Resource,
        @param.query.object('where', getWhereSchemaFor(Resource)) where?: Where,
      ): Promise<Count> {
        return await this.resourceRepository.updateAll(resource, where);
      } */
    async findById(id) {
        return await this.resourceRepository.findById(id);
    }
    /* @patch('/resources/{id}', {
      responses: {
        '204': {
          description: 'Resource PATCH success',
        },
      },
    })
    async updateById(
      @param.path.number('id') id: number,
      @requestBody() resource: Resource,
    ): Promise<void> {
      await this.resourceRepository.updateById(id, resource);
    }
   */
    async deleteById(id) {
        await this.resourceRepository.deleteById(id);
    }
};
__decorate([
    rest_1.post('/resources/{container}/upload', {
        responses: {
            '200': {
                description: 'Resource model upload instance',
                content: { 'application/json': { schema: { 'x-ts-type': models_1.Resource } } },
                'Access-Control-Allow-Credentials': 'false'
            },
        }
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
], ResourcesController.prototype, "create", null);
__decorate([
    rest_1.get('/Resources/count', {
        responses: {
            '200': {
                description: 'Resource model count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    __param(0, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Resource))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "count", null);
__decorate([
    rest_1.get('/Resources', {
        responses: {
            '200': {
                description: 'Array of Resource model instances',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: { 'x-ts-type': models_1.Resource } },
                    },
                },
            },
        },
    }),
    __param(0, rest_1.param.query.object('filter', rest_1.getFilterSchemaFor(models_1.Resource))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "find", null);
__decorate([
    rest_1.get('/Resources/{id}', {
        responses: {
            '200': {
                description: 'Resource model instance',
                content: { 'application/json': { schema: { 'x-ts-type': models_1.Resource } } },
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "findById", null);
__decorate([
    authentication_1.authenticate('BasicStrategy'),
    rest_1.del('/Resources/{id}', {
        responses: {
            '204': {
                description: 'Resource DELETE success',
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "deleteById", null);
ResourcesController = __decorate([
    __param(0, repository_1.repository(repositories_1.ResourceRepository)),
    __param(1, context_1.inject(authentication_1.AuthenticationBindings.CURRENT_USER, { optional: true })),
    __metadata("design:paramtypes", [repositories_1.ResourceRepository, Object])
], ResourcesController);
exports.ResourcesController = ResourcesController;
//# sourceMappingURL=resources.controller.js.map