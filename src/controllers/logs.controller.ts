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
        content: {'application/json': {schema: getModelSchemaRef(Logs)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Logs, {
            title: 'NewLogs',
            exclude: ['id'],
          }),
        },
      },
    })
    logs: Omit<Logs, 'id'>,
  ): Promise<Logs> {
    return this.logsRepository.create(logs);
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
    @param.query.object('where', getWhereSchemaFor(Logs)) where?: Where<Logs>,
  ): Promise<Count> {
    return this.logsRepository.count(where);
  }

  @get('/logs', {
    responses: {
      '200': {
        description: 'Array of Logs model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Logs)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Logs)) filter?: Filter<Logs>,
  ): Promise<Logs[]> {
    return this.logsRepository.find(filter);
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
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Logs, {partial: true}),
        },
      },
    })
    logs: Logs,
    @param.query.object('where', getWhereSchemaFor(Logs)) where?: Where<Logs>,
  ): Promise<Count> {
    return this.logsRepository.updateAll(logs, where);
  }

  @get('/logs/{id}', {
    responses: {
      '200': {
        description: 'Logs model instance',
        content: {'application/json': {schema: getModelSchemaRef(Logs)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Logs> {
    return this.logsRepository.findById(id);
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
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Logs, {partial: true}),
        },
      },
    })
    logs: Logs,
  ): Promise<void> {
    await this.logsRepository.updateById(id, logs);
  }

  @put('/logs/{id}', {
    responses: {
      '204': {
        description: 'Logs PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() logs: Logs,
  ): Promise<void> {
    await this.logsRepository.replaceById(id, logs);
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
