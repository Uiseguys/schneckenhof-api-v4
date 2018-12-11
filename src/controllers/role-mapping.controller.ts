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
import {RoleMapping} from '../models';
import {RoleMappingRepository} from '../repositories';

export class RoleMappingController {
  constructor(
    @repository(RoleMappingRepository)
    public roleMappingRepository : RoleMappingRepository,
  ) {}

  @post('/role-mappings', {
    responses: {
      '200': {
        description: 'RoleMapping model instance',
        content: {'application/json': {schema: {'x-ts-type': RoleMapping}}},
      },
    },
  })
  async create(@requestBody() roleMapping: RoleMapping): Promise<RoleMapping> {
    return await this.roleMappingRepository.create(roleMapping);
  }

  @get('/role-mappings/count', {
    responses: {
      '200': {
        description: 'RoleMapping model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(RoleMapping)) where?: Where,
  ): Promise<Count> {
    return await this.roleMappingRepository.count(where);
  }

  @get('/role-mappings', {
    responses: {
      '200': {
        description: 'Array of RoleMapping model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': RoleMapping}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(RoleMapping)) filter?: Filter,
  ): Promise<RoleMapping[]> {
    return await this.roleMappingRepository.find(filter);
  }

  @patch('/role-mappings', {
    responses: {
      '200': {
        description: 'RoleMapping PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() roleMapping: RoleMapping,
    @param.query.object('where', getWhereSchemaFor(RoleMapping)) where?: Where,
  ): Promise<Count> {
    return await this.roleMappingRepository.updateAll(roleMapping, where);
  }

  @get('/role-mappings/{id}', {
    responses: {
      '200': {
        description: 'RoleMapping model instance',
        content: {'application/json': {schema: {'x-ts-type': RoleMapping}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<RoleMapping> {
    return await this.roleMappingRepository.findById(id);
  }

  @patch('/role-mappings/{id}', {
    responses: {
      '204': {
        description: 'RoleMapping PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() roleMapping: RoleMapping,
  ): Promise<void> {
    await this.roleMappingRepository.updateById(id, roleMapping);
  }

  @del('/role-mappings/{id}', {
    responses: {
      '204': {
        description: 'RoleMapping DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.roleMappingRepository.deleteById(id);
  }
}
