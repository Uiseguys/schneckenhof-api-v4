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
import {Package} from '../models';
import {PackageRepository} from '../repositories';

export class PackageController {
  constructor(
    @repository(PackageRepository)
    public packageRepository: PackageRepository,
  ) {}

  @post('/packages', {
    responses: {
      '200': {
        description: 'Package model instance',
        content: {'application/json': {schema: getModelSchemaRef(Package)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Package, {
            title: 'NewPackage',
            exclude: ['id'],
          }),
        },
      },
    })
    customPackage: Omit<Package, 'id'>,
  ): Promise<Package> {
    return this.packageRepository.create(customPackage);
  }

  @get('/packages/count', {
    responses: {
      '200': {
        description: 'Package model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Package))
    where?: Where<Package>,
  ): Promise<Count> {
    return this.packageRepository.count(where);
  }

  @get('/packages', {
    responses: {
      '200': {
        description: 'Array of Package model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Package)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Package))
    filter?: Filter<Package>,
  ): Promise<Package[]> {
    return this.packageRepository.find(filter);
  }

  @patch('/packages', {
    responses: {
      '200': {
        description: 'Package PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Package, {partial: true}),
        },
      },
    })
    customPackage: Package,
    @param.query.object('where', getWhereSchemaFor(Package))
    where?: Where<Package>,
  ): Promise<Count> {
    return this.packageRepository.updateAll(customPackage, where);
  }

  @get('/packages/{id}', {
    responses: {
      '200': {
        description: 'Package model instance',
        content: {'application/json': {schema: getModelSchemaRef(Package)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Package> {
    return this.packageRepository.findById(id);
  }

  @patch('/packages/{id}', {
    responses: {
      '204': {
        description: 'Package PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Package, {partial: true}),
        },
      },
    })
    customPackage: Package,
  ): Promise<void> {
    await this.packageRepository.updateById(id, customPackage);
  }

  @put('/packages/{id}', {
    responses: {
      '204': {
        description: 'Package PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() customPackage: Package,
  ): Promise<void> {
    await this.packageRepository.replaceById(id, customPackage);
  }

  @del('/packages/{id}', {
    responses: {
      '204': {
        description: 'Package DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.packageRepository.deleteById(id);
  }
}
