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
  Response,
  RestBindings,
} from '@loopback/rest';
import {inject} from '@loopback/context';
import {Wine} from '../models';
import {WineRepository} from '../repositories';
import {PackageRepository} from '../repositories';
import {AuthenticationBindings, authenticate} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';

export class WineController {
  constructor(
    @repository(WineRepository)
    public wineRepository: WineRepository,
    @repository(PackageRepository)
    public packageRepository: PackageRepository,
    @inject(AuthenticationBindings.CURRENT_USER, {optional: true})
    private customUser: UserProfile,
  ) {}

  @authenticate('BasicStrategy')
  @post('/wines', {
    responses: {
      '200': {
        description: 'Wine model instance',
        content: {'application/json': {schema: getModelSchemaRef(Wine)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Wine, {
            title: 'NewWine',
            exclude: ['id'],
          }),
        },
      },
    })
    wine: Omit<Wine, 'id'>,
  ): Promise<Wine> {
    return this.wineRepository.create(wine);
  }

  @authenticate('BasicStrategy')
  @get('/wines/count', {
    responses: {
      '200': {
        description: 'Wine model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Wine)) where?: Where<Wine>,
  ): Promise<Count> {
    return this.wineRepository.count(where);
  }

  @get('/wines', {
    responses: {
      '200': {
        description: 'Array of Wine model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Wine)},
          },
        },
      },
    },
  })
  async find(
    @inject(RestBindings.Http.RESPONSE) res: Response,
    @param.query.object('filter', getFilterSchemaFor(Wine))
    filter?: Filter<Wine>,
  ): Promise<object> {
    let index;
    const filteredWine = await this.wineRepository.find(filter);
    const packages = await this.packageRepository.find({});
    if (!(filteredWine.length > 0)) {
      res.statusCode = 500;
      return {
        error: {
          statusCode: 500,
          message:
            'No Wines Have Been Found, Check Your Query or Check Your Wines Database',
        },
      };
    }
    if (!(packages.length > 0)) {
      res.statusCode = 500;
      return {
        error: {
          statusCode: 500,
          message: 'No Package Entries have Been Found',
        },
      };
    }
    return filteredWine.map(item => {
      index = packages.findIndex((x: any) => {
        x.id == item.packagingId;
      });
      if (index > -1) {
        item['packaging'] = packages[index];
      }
      return item;
    });
  }

  @patch('/wines', {
    responses: {
      '200': {
        description: 'Wine PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Wine, {partial: true}),
        },
      },
    })
    wine: Wine,
    @param.query.object('where', getWhereSchemaFor(Wine)) where?: Where<Wine>,
  ): Promise<Count> {
    return this.wineRepository.updateAll(wine, where);
  }

  @get('/wines/{id}', {
    responses: {
      '200': {
        description: 'Wine model instance',
        content: {'application/json': {schema: getModelSchemaRef(Wine)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Wine> {
    return this.wineRepository.findById(id);
  }

  @authenticate('BasicStrategy')
  @patch('/wines/{id}', {
    responses: {
      '204': {
        description: 'Wine PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Wine, {partial: true}),
        },
      },
    })
    wine: Wine,
  ): Promise<void> {
    await this.wineRepository.updateById(id, wine);
  }

  @authenticate('BasicStrategy')
  @put('/wines/{id}', {
    responses: {
      '204': {
        description: 'Wine PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() wine: Wine,
  ): Promise<void> {
    await this.wineRepository.replaceById(id, wine);
  }

  @authenticate('BasicStrategy')
  @del('/wines/{id}', {
    responses: {
      '204': {
        description: 'Wine DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.wineRepository.deleteById(id);
  }
}
