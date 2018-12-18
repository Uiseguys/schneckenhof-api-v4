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
  patch,
  del,
  requestBody,
} from '@loopback/rest';
import { Setting } from '../models';
import { SettingRepository } from '../repositories';

export class SettingController {
  constructor(
    @repository(SettingRepository)
    public settingRepository: SettingRepository,
  ) { }
  /*
    @post('/setting', {
      responses: {
        '200': {
          description: 'Setting model instance',
          content: { 'application/json': { schema: { 'x-ts-type': Setting } } },
        },
      },
    })
    async create(@requestBody() setting: Setting): Promise<Setting> {
      return await this.settingRepository.create(setting);
    }
   */
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
