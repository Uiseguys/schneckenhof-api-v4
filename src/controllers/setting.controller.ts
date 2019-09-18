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
  requestBody,
  RestBindings,
  Response,
  Request
} from '@loopback/rest';
import {inject} from '@loopback/context';
import { Setting } from '../models';
import { SettingRepository } from '../repositories';
import { AuthenticationBindings, authenticate } from '@loopback/authentication';
import { UserProfile } from '@loopback/security';

export class SettingController {
  constructor(
    @repository(SettingRepository)
    public settingRepository: SettingRepository,
    @inject(AuthenticationBindings.CURRENT_USER, {optional: true}) private user: UserProfile
  ) { }
  
    @authenticate('BasicStrategy')
    @post('/Settings/upsertWithWhere', {
      responses: {
        '200': {
          description: 'Setting model instance',
          content: { 'application/json': { schema: { 'x-ts-type': Setting } } },
        },
      },
    })
    async upsertWithWhere(@requestBody({
      description: 'data',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              key: {type: 'string'},
              value: {
                type: 'object',
              }
            },
          },
        },
      },
    })@inject(RestBindings.Http.REQUEST) request: Request,@inject(RestBindings.Http.RESPONSE) response: Response,@param.query.object('where', getWhereSchemaFor(Setting)) where?: Where): Promise<void> {
       let self = this;
      this.settingRepository.find({where: {key: request.body.key}},function(err:any, settingInstance:any){
            if(settingInstance.length>0){
              self.settingRepository.updateAll(request.body, {key:request.body.key});
            }else{
                let createjson ={
                   id: Math.floor(1000 + Math.random() * 9000),
                   key:request.body.key,
                   value:request.body.value
                }
              self.settingRepository.create(createjson);
            }
      })
      //return await this.settingRepository.create(setting);
    }
   
  @get('/Settings/count', {
    responses: {
      '200': {
        description: 'Setting model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Setting)) where?: Where,
  ): Promise<Count> {
    return await this.settingRepository.count(where);
  }

  @get('/Settings', {
    responses: {
      '200': {
        description: 'Array of Setting model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Setting } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Setting)) filter?: Filter,
  ): Promise<Setting[]> {
    return await this.settingRepository.find(filter);
  }

  /*   @patch('/setting', {
      responses: {
        '200': {
          description: 'Setting PATCH success count',
          content: { 'application/json': { schema: CountSchema } },
        },
      },
    })
    async updateAll(
      @requestBody() setting: Setting,
      @param.query.object('where', getWhereSchemaFor(Setting)) where?: Where,
    ): Promise<Count> {
      return await this.settingRepository.updateAll(setting, where);
    } */

  /*   @get('/setting/{id}', {
      responses: {
        '200': {
          description: 'Setting model instance',
          content: { 'application/json': { schema: { 'x-ts-type': Setting } } },
        },
      },
    })
    async findById(@param.path.number('id') id: number): Promise<Setting> {
      return await this.settingRepository.findById(id);
    } */


  @authenticate('BasicStrategy')
  @patch('/Settings/{id}', {
    responses: {
      '204': {
        description: 'Setting PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() setting: Setting,
  ): Promise<void> {
    await this.settingRepository.updateById(id, setting);
  }

  @post('/Settings/netlify', {
    responses: {
      '200': {
        description: 'Setting model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Setting } } },
      },
    },
  })
  async upsertWithWheres(@requestBody({
    description: 'data',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            key: { type: 'string' },
            value: {
              type: 'object',
            }
          },
        },
      },
    },
  }) @inject(RestBindings.Http.REQUEST) request: Request, @inject(RestBindings.Http.RESPONSE) response: Response, @param.query.object('where', getWhereSchemaFor(Setting)) where?: Where): Promise<void> {
    let self = this;
    this.settingRepository.find({ where: { key: "netlifyHook" } }, function (err: any, settingInstance: any) {
      if (settingInstance.length > 0) {
        self.settingRepository.updateAll({value: request.body}, { key: "netlifyHook" });
      } else {
        let createjson = {
          id: Math.floor(1000 + Math.random() * 9000),
          key: "netlifyHook",
          value: request.body,
        }
        self.settingRepository.create(createjson);
      }
    })
    //return await this.settingRepository.create(setting);
  }


  @authenticate('BasicStrategy')
  @del('/Settings/{id}', {
    responses: {
      '204': {
        description: 'Setting DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.settingRepository.deleteById(id);
  }
}
