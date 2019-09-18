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
  getWhereSchemaFor,
  patch,
  del,
  RestBindings,
  requestBody,
  Request,
  Response,
} from '@loopback/rest';
import { inject } from '@loopback/context';
import { Template } from '../models';
import { TemplateRepository } from '../repositories';
import { AuthenticationBindings } from '@loopback/authentication';
import { UserProfile } from '@loopback/security';
import * as config from '../datasources/db.datasource.json';
import * as multer from 'multer';
import * as fs from 'fs'
import { request } from 'http';
export class TemplateController {
  constructor(
    @repository(TemplateRepository)
    public templateRepository: TemplateRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true }) private user: UserProfile
  ) { }

  // @authenticate('BasicStrategy')
  @post('/Templates', {
    responses: {
      '200': {
        description: 'Template model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Template } } },
      },
    },
  })
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
  ) request: Request, @inject(RestBindings.Http.RESPONSE) response: Response): Promise<object> {
    return new Promise<object>((resolve, reject) => {
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
          weblinkurl = `/${dirPath}/${uploadedFileName}`
          filetype = file.mimetype
          cb(null, fileName);
        }
      });
      var upload = multer({
        storage: storage
      }).single('file');
      upload(request, response, function (err) {
        if (err) reject(err);
        else {

          let createjson = {
            id: Math.floor(1000 + Math.random() * 9000),
            name: uploadedFileName,
            originalFilename: originalFileName,
          }
          self.templateRepository.create(createjson)
          resolve({
            fileuploaded: uploadedFileName,
            weblinkurl: weblinkurl
          });
        }
      });
    });
  }

  @get('/Templates/count', {
    responses: {
      '200': {
        description: 'Template model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Template)) where?: Where,
  ): Promise<Count> {
    return await this.templateRepository.count(where);
  }

  @get('/Templates', {
    responses: {
      '200': {
        description: 'Array of Template model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Template } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Template)) filter?: Filter,
  ): Promise<Template[]> {
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

  @get('/Templates/{id}', {
    responses: {
      '200': {
        description: 'Template model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Template } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Template> {
    return await this.templateRepository.findById(id);
  }

  /* @authenticate('BasicStrategy')
   @patch('/Templates/{id}', {
     responses: {
       '204': {
         description: 'Template PATCH success',
       },
     },
   })
   async updateById(
     @param.path.number('id') id: number,
     @requestBody() template: Template,
   ): Promise<void> {
     await this.templateRepository.updateById(id, template);
   }*/


  // @authenticate('BasicStrategy')
  // @del('/Templates/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'Template DELETE success',
  //     },
  //   },
  // })
  // async deleteById(@param.path.number('id') id: number): Promise<void> {
  //   await this.templateRepository.deleteById(id);
  // }
}
