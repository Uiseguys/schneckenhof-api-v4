import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  get,
  post,
  del,
  param,
  Request,
  requestBody,
  Response,
  getWhereSchemaFor,
  getModelSchemaRef,
  getFilterSchemaFor,
  RestBindings,
} from '@loopback/rest';
import {inject} from '@loopback/context';
import {Storage} from '@google-cloud/storage';
import {AuthenticationBindings, authenticate} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';
import {Resource} from '../models';
import * as multiparty from 'multiparty';
import {promisify} from 'util';
import * as fs from 'fs';

// Instantiation of Google Storage Client
const storage = new Storage();
/**
 * A simple controller to handle Google Bucket Storage Operations
 */
export class ResourceController {
  constructor(
    @inject(AuthenticationBindings.CURRENT_USER, {optional: true})
    private user: UserProfile,
  ) {}

  @authenticate('BasicStrategy')
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
  async getAllFiles(
    @param.query.object('filter', getFilterSchemaFor(Resource))
    filter?: Filter<Resource>,
  ): Promise<object> {
    const allFiles = await storage
      .bucket('schneckenhof-development')
      .getFiles({prefix: 'wine-images'});
    // Apply shift to remove first entry which is the folder name
    // As Google Cloud Storage perceives it as an object as well
    let count = 0;
    // Custom filter object function
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

  @authenticate('BasicStrategy')
  @post('/resources/upload', {
    responses: {
      '200': {
        description: 'Successfully Uploaded File to Google Bucket Storage',
        content: {
          'application/json': {
            schema: {type: 'object'},
          },
        },
      },
    },
  })
  async create(
    @requestBody({
      description: 'multipart/form-data value.',
      require: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
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
    // This function checks if the incoming requet has a folder query
    // If it does it returns the provided string if doesn't it returns an
    // empty string
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
            `${new Date().toISOString()} - Error - POST REQUEST - /resources/upload ${
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
                        `${new Date().toISOString()} - Error - POST REQUEST - /resources/upload ${
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
  ): Promise<Buffer | object> {
    return storage
      .bucket('schneckenhof-development')
      .file(`wine-images/${image}`)
      .download()
      .then(data => {
        res.contentType('image/jpeg');
        return data[0];
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

  @authenticate('BasicStrategy')
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
}
