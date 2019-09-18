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
import { inject } from '@loopback/context';
import { Resource } from '../models';
import { ResourceRepository } from '../repositories';
import * as config from '../datasources/db.datasource.json';
import * as multer from 'multer';
import * as fs from 'fs'
import { request } from 'http';
import { AuthenticationBindings, authenticate } from '@loopback/authentication';
import { UserProfile } from '@loopback/security';

export class ResourcesController {
  constructor(
    @repository(ResourceRepository)
    public resourceRepository: ResourceRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true }) private user: UserProfile
  ) { }

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
  @post('/resources/{container}/upload', {
    responses: {
      '200': {
        description: 'Resource model upload instance',
        content: { 'application/json': { schema: { 'x-ts-type': Resource } } },
        'Access-Control-Allow-Credentials': 'false'
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

  async create(@requestBody(
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
  ) request: Request, @inject(RestBindings.Http.RESPONSE) response: Response): Promise<object> {
    return new Promise<object>((resolve, reject) => {
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
      }, function (err: any) { });


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
        form.parse(request, (err: any, fields: any, files: any) => {
          if (err) reject(err);
          const file = files['file'][0]; // get the file from the returned files object
          if (!file) reject('File was not found in form data.');
          else {
            var ext = file.originalFilename.substring(file.originalFilename.lastIndexOf("."));
            var fileName = Date.now() + ext;
            uploadedFileName = fileName;
            originalFileName = file.originalFilename;
            filetype = file.headers['content-type'];

            bucket.upload(file.path, function (err: any, file: any) {
              if (err) reject(err);
              else {
                weblinkurl = `/${dirPath}/${uploadedFileName}`

                let createjson = {
                  id: Math.floor(1000 + Math.random() * 9000),
                  resourceId: uploadedFileName,
                  weblinkUrl: file.metadata.mediaLink,
                  originalFilename: originalFileName,
                  type: filetype
                }

                console.log(createjson)
                self.resourceRepository.create(createjson)
                resolve({
                  fileuploaded: uploadedFileName,
                  weblinkurl: weblinkurl
                });
              }
            })
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


  @get('/Resources/count', {
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

  @get('/Resources', {
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

  @get('/Resources/{id}', {
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

  @authenticate('BasicStrategy')
  @del('/Resources/{id}', {
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
