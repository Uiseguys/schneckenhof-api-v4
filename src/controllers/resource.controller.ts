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
// import {ResourceRepository} from '../repositories';
import {AuthenticationBindings, authenticate} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';
import * as multiparty from 'multiparty';
import {Storage} from '@google-cloud/storage';
const storage = new Storage();

export class ResourceController {
  constructor(
    // @repository(ResourceRepository)
    // public resourceRepository: ResourceRepository,
    @inject(AuthenticationBindings.CURRENT_USER, {optional: true})
    private user: UserProfile,
  ) {}

  @get('/resources/all', {
    responses: {
      '200': {
        description:
          'Retrieval of images from a folder in a Google Storage Bucket',
        content: {
          'application/json': {
            schema: {type: 'object'},
          },
        },
      },
    },
  })
  async getAll(
    @param.query.object('filter', getFilterSchemaFor(Resource))
    filter?: Filter<Resource>,
  ): Promise<object> {
    const allFiles = await storage
      .bucket('schneckenhof-development')
      .getFiles({prefix: 'wine-images'});
    // Apply shift to remove first entry which is the folder name
    // As Google Cloud Storage perceives it as an object as well
    // Custom filter object function
    let count = 0;
    const filterObj = (item: {name: string}) => {
      if (filter != undefined) {
        if (filter.skip != undefined && filter.limit != undefined) {
          if (filter.skip == 0 && count <= filter.limit) {
            count++;
            return !('wine-images/' == item.name);
          } else if (
            count > filter.skip * filter.limit &&
            count <= (filter.skip + 1) * filter.limit
          ) {
            count++;
            return !('wine-images/' == item.name);
          } else {
            count++;
            return !true;
          }
        }
      } else {
        return !('wine-images/' == item.name);
      }
    };
    return allFiles[0].filter(filterObj).map(item => {
      return {
        id: item.id,
        name: item.name,
        url: `/resources/download/${item.name.replace('wine-images/', '')}`,
      };
    });
  }

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
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ): Promise<object | void> {
    const form = new multiparty.Form();
    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.log(
            `${new Date().toISOString()} - Error - POST REQUEST - /resources/upload - ${
              err.message
            }`,
          );
          reject({
            error: {
              statusCode: 500,
              message: 'Internal Server Error',
            },
          });
        }
        if (!files['file']) {
          err = new Error('No file has been uploaded');
          console.log(
            `${new Date().toISOString()} - Error - POST REQUEST - /resources/upload - ${
              err.message
            }`,
          );
          reject({
            error: {
              statusCode: 500,
              message: 'Internal Server Error',
            },
          });
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
                      console.log(
                        `${new Date().toISOString()} - Error - POST REQUEST - /resources/upload - ${
                          err.message
                        }`,
                      );
                      res.statusCode = 500;
                      reject({
                        error: {
                          statusCode: 500,
                          message: 'Internal Server Error',
                        },
                      });
                    }
                    if (file) {
                      fileArr[index] = file;
                    }
                  },
                );
              }
            },
          );
          resolve({
            info: {
              statusCode: 200,
              message: 'Successfully Uploaded Image(s)',
            },
          });
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
  ): Promise<Buffer | object | void> {
    return storage
      .bucket('schneckenhof-development')
      .file(`wine-images/${image}`)
      .download()
      .then(data => {
	res.contentType('image/jpeg');
	//res.writeHead(200, {'Content-Type': 'image/jpeg'});
	res.end(data[0]);
      })
      .catch(err => {
        console.log(
          `${new Date().toISOString()} - Error - GET REQUEST - /resources/download - ${
            err.message
          }`,
        );
        res.statusCode = 500;
        return {
          error: {
            statusCode: 500,
            message: 'Internal Server Error',
          },
        };
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
    @inject(RestBindings.Http.RESPONSE) res: Response,
    @param.query.object('where', getWhereSchemaFor(Resource))
    where?: Where<Resource>,
  ): Promise<Count | object> {
    return storage
      .bucket('schneckenhof-development')
      .getFiles({prefix: 'wine-images'})
      .then(data => {
        const noFolderObject = (item: {name: string}) => {
          return !('wine-images/' == item.name);
        };
        return {count: data[0].filter(noFolderObject).length};
      })
      .catch(err => {
        console.log(
          `${new Date().toISOString()} - Error - GET REQUEST - /resources/count - ${
            err.message
          }`,
        );
        res.statusCode = 500;
        return {
          error: {
            statusCode: 500,
            message: 'Internal Server Error',
          },
        };
      });
  }

  @del('/resources/{id}', {
    responses: {
      '204': {
        description: 'File DELETED successfully',
      },
    },
  })
  async deleteFile(
    @inject(RestBindings.Http.RESPONSE) res: Response,
    @param.path.string('id') id: string,
  ): Promise<object> {
    return storage
      .bucket('schneckenhof-development')
      .file(decodeURIComponent(id))
      .delete()
      .then(data => {
        return data;
      })
      .catch(err => {
        console.log(
          `${new Date().toISOString()} - Error - DELETE REQUEST - /resources - ${
            err.message
          }`,
        );
        res.statusCode = 500;
        return {
          error: {
            statusCode: 500,
            message: 'Internal Server Error',
          },
        };
      });
  }

  // Commented out as they are not needed
  // @get('/resources', {
  //   responses: {
  //     '200': {
  //       description: 'Array of Resource model instances',
  //       content: {
  //         'application/json': {
  //           schema: {type: 'array', items: getModelSchemaRef(Resource)},
  //         },
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.query.object('filter', getFilterSchemaFor(Resource))
  //   filter?: Filter<Resource>,
  // ): Promise<Resource[]> {
  //   return this.resourceRepository.find(filter);
  // }

  // @patch('/resources', {
  //   responses: {
  //     '200': {
  //       description: 'Resource PATCH success count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Resource, {partial: true}),
  //       },
  //     },
  //   })
  //   resource: Resource,
  //   @param.query.object('where', getWhereSchemaFor(Resource))
  //   where?: Where<Resource>,
  // ): Promise<Count> {
  //   return this.resourceRepository.updateAll(resource, where);
  // }

  // @get('/resources/{id}', {
  //   responses: {
  //     '200': {
  //       description: 'Resource model instance',
  //       content: {'application/json': {schema: getModelSchemaRef(Resource)}},
  //     },
  //   },
  // })
  // async findById(@param.path.number('id') id: number): Promise<Resource> {
  //   return this.resourceRepository.findById(id);
  // }

  // @patch('/resources/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'Resource PATCH success',
  //     },
  //   },
  // })
  // async updateById(
  //   @param.path.number('id') id: number,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Resource, {partial: true}),
  //       },
  //     },
  //   })
  //   resource: Resource,
  // ): Promise<void> {
  //   await this.resourceRepository.updateById(id, resource);
  // }

  // @put('/resources/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'Resource PUT success',
  //     },
  //   },
  // })
  // async replaceById(
  //   @param.path.number('id') id: number,
  //   @requestBody() resource: Resource,
  // ): Promise<void> {
  //   await this.resourceRepository.replaceById(id, resource);
  // }

  // @del('/resources/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'Resource DELETE success',
  //     },
  //   },
  // })
  // async deleteById(@param.path.number('id') id: number): Promise<void> {
  //   await this.resourceRepository.deleteById(id);
  // }
}
