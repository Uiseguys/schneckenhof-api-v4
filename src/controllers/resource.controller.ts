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
import {Resource} from '../models';
import {ResourceRepository} from '../repositories';

export class ResourceController {
  constructor(
    @repository(ResourceRepository)
    public resourceRepository : ResourceRepository,
  ) {}

  @post('/resources', {
    responses: {
      '200': {
        description: 'Resource model instance',
        content: {'application/json': {schema: getModelSchemaRef(Resource)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Resource, {
            title: 'NewResource',
            exclude: ['id'],
          }),
        },
      },
    })
    resource: Omit<Resource, 'id'>,
  ): Promise<Resource> {
    return this.resourceRepository.create(resource);
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
    @param.query.object('where', getWhereSchemaFor(Resource)) where?: Where<Resource>,
  ): Promise<Count> {
    return this.resourceRepository.count(where);
  }

  @get('/resources', {
    responses: {
      '200': {
        description: 'Array of Resource model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Resource)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Resource)) filter?: Filter<Resource>,
  ): Promise<Resource[]> {
    return this.resourceRepository.find(filter);
  }

  @patch('/resources', {
    responses: {
      '200': {
        description: 'Resource PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Resource, {partial: true}),
        },
      },
    })
    resource: Resource,
    @param.query.object('where', getWhereSchemaFor(Resource)) where?: Where<Resource>,
  ): Promise<Count> {
    return this.resourceRepository.updateAll(resource, where);
  }

  @get('/resources/{id}', {
    responses: {
      '200': {
        description: 'Resource model instance',
        content: {'application/json': {schema: getModelSchemaRef(Resource)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Resource> {
    return this.resourceRepository.findById(id);
  }

  @patch('/resources/{id}', {
    responses: {
      '204': {
        description: 'Resource PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Resource, {partial: true}),
        },
      },
    })
    resource: Resource,
  ): Promise<void> {
    await this.resourceRepository.updateById(id, resource);
  }

  @put('/resources/{id}', {
    responses: {
      '204': {
        description: 'Resource PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() resource: Resource,
  ): Promise<void> {
    await this.resourceRepository.replaceById(id, resource);
  }

  @del('/resources/{id}', {
    responses: {
      '204': {
        description: 'Resource DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.resourceRepository.deleteById(id);
  }
}
