import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  del,
  post,
  requestBody,
  RestBindings,
  Response,
  Request
} from '@loopback/rest';
import {inject} from '@loopback/context';
import { Resource } from '../models';
import { ResourceRepository } from '../repositories';
import * as config from '../datasources/db.datasource.json';
import * as multer from 'multer';
import * as fs from 'fs'
import { request } from 'http';

export class ResourcesController {
  constructor(
    @repository(ResourceRepository)
    public resourceRepository: ResourceRepository
  ) { }

  @post('/resources', {
    responses: {
      '200': {
        description: 'Resource model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Resource } } },
      },
    },
  })
  async create(@requestBody() resource: Resource,@inject(RestBindings.Http.RESPONSE) response: Response,): Promise<Resource> {

    return await this.resourceRepository.create(resource);
  }

  @post('/resources/{container}/upload', {
    responses: {
      '200': {
        description: 'Resource model upload instance',
        content: { 'application/json': { schema: { 'x-ts-type': Resource } } },
      },
    }
  })

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
  
  async upload(@requestBody(
    {
      content: {
        'multipart/form-data': {
          'x-parser': 'stream',
          schema: {
            type: 'object'
          },
        },
      },
    }
  ) request: Request,@inject(RestBindings.Http.RESPONSE) response: Response): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      let self = this;
      var uploadedFileName = '';
      var originalFileName = '';
      var weblinkurl = '';
      var filetype   = '';
      const container    = config.storage.container || 'schneckenhof';
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
            weblinkurl       = `/${dirPath}/${uploadedFileName}`
            filetype         = file.mimetype
            cb(null, fileName);
        }
      });
      var upload = multer({
        storage: storage
      }).single('file');
      upload(request, response, function (err) {
        if (err) reject(err);
        else{
          let createjson = {
            resourceId: uploadedFileName,
            weblinkUrl: weblinkurl,
            originalFilename: originalFileName,
            type: filetype
          }
          self.resourceRepository.create(createjson)
          resolve({
            fileuploaded: uploadedFileName,
            weblinkurl: weblinkurl
           });
        }
      }); 
    });
  }

  @post('/resources/{container}/download/{name}', {
    responses: {
      '200': {
        description: 'Resource model upload instance',
        content: { 'application/json': { schema: { 'x-ts-type': Resource } } },
      },
    },
  })
  async download(@requestBody() resource: Resource): Promise<Resource> {
    return await this.resourceRepository.create(resource);
  }


  @get('/resources/count', {
    responses: {
      '200': {
        description: 'Resource model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Resource)) where?: Where,
  ): Promise<Count> {
    return await this.resourceRepository.count(where);
  }

  @get('/resources', {
    responses: {
      '200': {
        description: 'Array of Resource model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Resource } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Resource)) filter?: Filter,
  ): Promise<Resource[]> {
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

  @get('/resources/{id}', {
    responses: {
      '200': {
        description: 'Resource model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Resource } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Resource> {
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
  @del('/resources/{id}', {
    responses: {
      '204': {
        description: 'Resource DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.resourceRepository.deleteById(id);
  }
}
