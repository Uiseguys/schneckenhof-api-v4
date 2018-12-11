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
import {Logs} from '../models';
import {LogsRepository} from '../repositories';

export class LogsController {
  constructor(
    @repository(LogsRepository)
    public logsRepository : LogsRepository,
  ) {}

  @post('/logs', {
    responses: {
      '200': {
        description: 'Logs model instance',
        content: {'application/json': {schema: {'x-ts-type': Logs}}},
      },
    },
  })
  async create(@requestBody() logs: Logs): Promise<Logs> {
    return await this.logsRepository.create(logs);
  }

  @get('/logs/count', {
    responses: {
      '200': {
        description: 'Logs model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Logs)) where?: Where,
  ): Promise<Count> {
    return await this.logsRepository.count(where);
  }

  @get('/logs', {
    responses: {
      '200': {
        description: 'Array of Logs model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Logs}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Logs)) filter?: Filter,
  ): Promise<Logs[]> {
    return await this.logsRepository.find(filter);
  }

  @patch('/logs', {
    responses: {
      '200': {
        description: 'Logs PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() logs: Logs,
    @param.query.object('where', getWhereSchemaFor(Logs)) where?: Where,
  ): Promise<Count> {
    return await this.logsRepository.updateAll(logs, where);
  }

  @get('/logs/{id}', {
    responses: {
      '200': {
        description: 'Logs model instance',
        content: {'application/json': {schema: {'x-ts-type': Logs}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Logs> {
    return await this.logsRepository.findById(id);
  }

  @patch('/logs/{id}', {
    responses: {
      '204': {
        description: 'Logs PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() logs: Logs,
  ): Promise<void> {
    await this.logsRepository.updateById(id, logs);
  }

  @del('/logs/{id}', {
    responses: {
      '204': {
        description: 'Logs DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.logsRepository.deleteById(id);
  }
}
