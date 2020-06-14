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
  del,
  requestBody,
} from '@loopback/rest';
import {inject} from '@loopback/context';
import {Setting} from '../models';
import {SettingRepository} from '../repositories';
import {AuthenticationBindings, authenticate} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';

export class SettingController {
  constructor(
    @repository(SettingRepository)
    public settingRepository: SettingRepository,
    @inject(AuthenticationBindings.CURRENT_USER, {optional: true})
    private user: UserProfile,
  ) {}

  @authenticate('BasicStrategy')
  @post('/settings', {
    responses: {
      '200': {
        description: 'Settings model instance',
        content: {'application/json': {schema: {type: 'object'}}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Setting, {partial: true}),
        },
      },
    })
    settings: Setting,
  ): Promise<Setting | Count> {
    const where = {key: settings.key};
    const allSettings = await this.settingRepository.find({});
    const findkey = await this.settingRepository.find({
      where: where,
    });
    if (findkey.length > 0) {
      return this.settingRepository.updateAll(settings, where);
    }
    if (allSettings) {
      const maxId = allSettings.reduce((acc, value) => {
        if (value) return acc >= value['id'] ? acc : value['id'];
        return acc;
      }, 0);
      settings['id'] = maxId;
    } else {
      settings['id'] = 1;
    }
    return this.settingRepository.create(settings);
  }

  @authenticate('BasicStrategy')
  @get('/settings/count', {
    responses: {
      '200': {
        description: 'Setting model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Setting))
    where?: Where<Setting>,
  ): Promise<Count> {
    return this.settingRepository.count(where);
  }

  @authenticate('BasicStrategy')
  @get('/settings', {
    responses: {
      '200': {
        description: 'Array of Setting model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Setting)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Setting))
    filter?: Filter<Setting>,
  ): Promise<Setting[]> {
    return this.settingRepository.find(filter);
  }

  @authenticate('BasicStrategy')
  @patch('/settings', {
    responses: {
      '200': {
        description: 'Setting PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Setting, {partial: true}),
        },
      },
    })
    setting: Setting,
    @param.query.object('where', getWhereSchemaFor(Setting))
    where?: Where<Setting>,
  ): Promise<Count> {
    return this.settingRepository.updateAll(setting, where);
  }

  @authenticate('BasicStrategy')
  @get('/settings/{id}', {
    responses: {
      '200': {
        description: 'Setting model instance',
        content: {'application/json': {schema: getModelSchemaRef(Setting)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Setting> {
    return this.settingRepository.findById(id);
  }

  @authenticate('BasicStrategy')
  @del('/settings/{id}', {
    responses: {
      '204': {
        description: 'Setting DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.settingRepository.deleteById(id);
  }

  // NETLIFY <--> INCOMING WEBHOOKS HANDLING
  @authenticate('BasicStrategy')
  @post('/settings/netlify/deploy', {
    responses: {
      '200': {
        description: 'Settings model instance',
        content: {'application/json': {schema: {type: 'object'}}},
      },
    },
  })
  async deployResponse(
    @requestBody({
      content: {
        'application/json': {
          schema: {type: 'object'},
        },
      },
    })
    buildHook: object,
  ): Promise<object> {
    const where = {key: 'netlifyHook'};
    const findKey = await this.settingRepository.find({where: where});
    if (findKey.length > 0) {
      return this.settingRepository.updateAll({value: buildHook}, where);
    }
    const id = Math.floor(1000 + Math.random() * 9000);
    return this.settingRepository.create({
      id: id,
      key: 'netlifyHook',
      value: buildHook,
    } as Setting);
  }
}
