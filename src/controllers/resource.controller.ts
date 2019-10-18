import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
  RestBindings,
  Response,
  Request,
} from '@loopback/rest';
import {inject} from '@loopback/context';
import {Resource} from '../models';
import {ResourceRepository} from '../repositories';
import {AuthenticationBindings, authenticate} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';
import * as multiparty from 'multiparty';
import {Storage} from '@google-cloud/storage';
const storage = new Storage();

export class ResourceController {
  constructor(
    @repository(ResourceRepository)
    public resourceRepository: ResourceRepository, // @inject(AuthenticationBindings.CURRENT_USER, {optional: true}) // private user: UserProfile,
  ) {}

  @post('/resources/upload', {
    responses: {
      '200': {
        description: 'Resource model instance',
        content: {'application/json': {schema: getModelSchemaRef(Resource)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'multipart/form-data': {
          'x-parser': 'stream',
          schema: {
            type: 'object',
          },
        },
      },
    })
    req: Request,
  ): Promise<object> {
    let statusCode = 500;
    let message = 'Something went wrong';
    const form = new multiparty.Form();
    return new Promise(async (resolve, reject) => {
      await form.parse(req, async (err, fields, files) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        if (!files['file']) {
          err = new Error('No file has been uploaded');
          console.log(err);
          return reject(err);
        }
        // Check to see if the file extension is that of an image
        if (files['file']) {
          let fileArr = [];
          await files['file'].forEach(
            (item: {path: string; originalFilename: string}, index: number) => {
              const fileExtensionCheck = /[^.][jpe?g|png|gif]$/.test(item.path);
              if (fileExtensionCheck) {
                // Use the google storage client library to upload the file
                storage.bucket('schneckenhof-development').upload(
                  item.path,
                  {
                    destination: `wine-images/${item.originalFilename}`,
                  },
                  (err, file) => {
                    if (err != null) {
                      console.log(err);
                      return reject(err);
                    }
                    if (file) {
                      fileArr[index] = file;
                    }
                  },
                );
              }
            },
          );
          statusCode = 200;
          message = 'Successfully Uploaded Image(s)';
          resolve({status: statusCode, msg: message});
        }
      });
    });
  }

  @get('/resources/download/{image}', {
    responses: {
      '200': {
        description: 'Download an Image',
        content: {
          'image/jpeg': {
            schema: {type: 'object'},
          },
        },
      },
    },
  })
  async findImage(
    @param.path.string('image') image: string,
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ): Promise<void> {
    return await storage
      .bucket('schneckenhof-development')
      .file(`wine-images/${image}`)
      .download()
      .then(data => {
        res.contentType('image/jpeg');
        res.end(data[0]);
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  @get('/resources/count', {
    responses: {
      '200': {
        description: 'Resource model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Resource))
    where?: Where<Resource>,
  ): Promise<Count> {
    return this.resourceRepository.count(where);
  }

  @get('/resources', {
    responses: {
      '200': {
        description: 'Array of Resource model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Resource)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Resource))
    filter?: Filter<Resource>,
  ): Promise<Resource[]> {
    return this.resourceRepository.find(filter);
  }

  @patch('/resources', {
    responses: {
      '200': {
        description: 'Resource PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Resource, {partial: true}),
        },
      },
    })
    resource: Resource,
    @param.query.object('where', getWhereSchemaFor(Resource))
    where?: Where<Resource>,
  ): Promise<Count> {
    return this.resourceRepository.updateAll(resource, where);
  }

  @get('/resources/{id}', {
    responses: {
      '200': {
        description: 'Resource model instance',
        content: {'application/json': {schema: getModelSchemaRef(Resource)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Resource> {
    return this.resourceRepository.findById(id);
  }

  @patch('/resources/{id}', {
    responses: {
      '204': {
        description: 'Resource PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Resource, {partial: true}),
        },
      },
    })
    resource: Resource,
  ): Promise<void> {
    await this.resourceRepository.updateById(id, resource);
  }

  @put('/resources/{id}', {
    responses: {
      '204': {
        description: 'Resource PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() resource: Resource,
  ): Promise<void> {
    await this.resourceRepository.replaceById(id, resource);
  }

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