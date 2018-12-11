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
} from '@loopback/rest';
import {Wine} from '../models';
import {WineRepository} from '../repositories';

export class WineController {
  constructor(
    @repository(WineRepository)
    public wineRepository : WineRepository,
  ) {}

  @post('/wines', {
    responses: {
      '200': {
        description: 'Wine model instance',
        content: {'application/json': {schema: {'x-ts-type': Wine}}},
      },
    },
  })
  async create(@requestBody() wine: Wine): Promise<Wine> {
    return await this.wineRepository.create(wine);
  }

  @get('/wines/count', {
    responses: {
      '200': {
        description: 'Wine model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Wine)) where?: Where,
  ): Promise<Count> {
    return await this.wineRepository.count(where);
  }

  @get('/wines', {
    responses: {
      '200': {
        description: 'Array of Wine model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Wine}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Wine)) filter?: Filter,
  ): Promise<Wine[]> {
    return await this.wineRepository.find(filter);
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
    @requestBody() wine: Wine,
    @param.query.object('where', getWhereSchemaFor(Wine)) where?: Where,
  ): Promise<Count> {
    return await this.wineRepository.updateAll(wine, where);
  }

  @get('/wines/{id}', {
    responses: {
      '200': {
        description: 'Wine model instance',
        content: {'application/json': {schema: {'x-ts-type': Wine}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Wine> {
    return await this.wineRepository.findById(id);
  }

  @patch('/wines/{id}', {
    responses: {
      '204': {
        description: 'Wine PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() wine: Wine,
  ): Promise<void> {
    await this.wineRepository.updateById(id, wine);
  }

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
