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
    @param.query.object('where', getWhereSchemaFor(Setting))
    where?: Where<Setting>,
  ): Promise<Setting | Count> {
    const findkey = await this.settingRepository.find({
      where: {key: settings.key},
    });
    if (findkey.length > 0) {
      return this.settingRepository.updateAll(settings, {key: settings.key});
    }
    settings.id = Math.floor(1000 + Math.random() * 9000);
    return this.settingRepository.create(settings);
  }

  @post('/settings/netlify', {
    responses: {
      '200': {
        description: 'Settings model instance',
        content: {'application/json': {schema: getModelSchemaRef(Setting)}},
      },
    },
  })
  async netlifyHook(
    @requestBody({
      content: {
        'application/json': {
          schema: {type: 'object'},
        },
      },
    })
    reqBody: object,
    @param.query.string('deploy')
    deploy: string,
  ): Promise<Count | Setting> {
    const findNetlify = await this.settingRepository.find({
      where: {key: 'netlifyHook'},
    });
    if (findNetlify.length > 0) {
      return this.settingRepository.updateAll(
        {value: reqBody},
        {key: 'netlifyHook'},
      );
    }
    return this.settingRepository.create({
      id: Math.floor(1000 + Math.random() * 9000),
      key: 'netlifyHook',
      value: reqBody,
    } as Setting);
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
}
