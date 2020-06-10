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
import {AuthenticationBindings, authenticate} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';
import {Resource} from '../models';
import * as multiparty from 'multiparty';
import * as fs from 'fs';

export class ResourceController {
  private cloudinary: object | any;
  constructor(
    @inject(AuthenticationBindings.CURRENT_USER, {optional: true})
    private user: UserProfile,
  ) {
    this.cloudinary = require('cloudinary').v2;
  }

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
    @inject(RestBindings.Http.RESPONSE) res: Response,
    @param.query.object('filter', getFilterSchemaFor(Resource))
    filter?: Filter<Resource>,
  ): Promise<object> {
    return new Promise((resolve, reject) =>
      this.cloudinary.api.resources_by_tag(
        'wines',
        {max_results: 500},
        (err: object | null, data: any | object | null) => {
          if (err) {
            reject({
              error: {
                statusCode: 500,
                message: 'Internal Server Error',
              },
            });
          }
          if (data.resources.length > 0) {
            resolve(
              data.resources.reduce(
                (acc: [null | object], value: object | any) => {
                  if (value.public_id != 'wines') {
                    acc.push({
                      public_id: value.public_id,
                      url: value.secure_url,
                    });
                  }
                  return acc;
                },
                [],
              ),
            );
          }
        },
      ),
    );
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
          const fileArr = [];
          await files['file'].forEach(
            (item: {path: string; originalFilename: string}, index: number) => {
              const fileExtensionCheck = /\.(jpe?g|png|gif)$/.test(item.path);
              if (fileExtensionCheck) {
                // Use the Cloudinary client library to upload the file
                let itemFilename = item.originalFilename.replace(
                  /\.(jpe?g|png|gif)$/g,
                  '',
                );
                itemFilename = itemFilename.replace(/\s/g, '_');
                console.log(itemFilename);
                this.cloudinary.uploader.upload(
                  item.path,
                  {public_id: `wines/${itemFilename}`, tags: 'wines'},
                  (newErr: null | Error, file: null | Response) => {
                    if (newErr != null) {
                      console.log(
                        `${new Date().toISOString()} - Error - POST REQUEST - /resources/upload ${
                          newErr.message
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
                      console.log(file);
                      fileArr[index] = file;
                      resolve(file);
                    }
                  },
                );
              }
            },
          );
        }
      });
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
    return new Promise((resolve, reject) =>
      this.cloudinary.api.resources_by_tag(
        'wines',
        {max_results: 500},
        (err: object | null, data: any | object | null) => {
          if (err) {
            reject({
              error: {
                statusCode: 500,
                message: 'Internal Server Error',
              },
            });
          }
          resolve({count: data.resources.length});
        },
      ),
    );
  }

  @authenticate('BasicStrategy')
  @del('/resources/{public_id}', {
    responses: {
      '204': {
        description: 'File DELETED successfully',
      },
    },
  })
  async deleteFile(
    @inject(RestBindings.Http.RESPONSE) res: Response,
    @param.path.string('public_id') public_id: string,
  ): Promise<object> {
    return this.cloudinary.api.delete_resources(
      [decodeURIComponent(public_id)],
      (err: null | object, data: null | object) => {
        if (err) {
          res.statusCode = 500;
          return {
            error: {
              statusCode: 500,
              message: 'Internal Server Error',
            },
          };
        }
        return data;
      },
    );
  }
}
