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
import { Package } from '../models';
import { PackageRepository } from '../repositories';

export class PackageController {
  constructor(
    @repository(PackageRepository)
    public packageRepository: PackageRepository,
  ) { }

  @post('/packaging', {
    responses: {
      '200': {
        description: 'Package model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Package } } },
      },
    },
  })
  async create(@requestBody() packages: Package): Promise<Package> {
    return await this.packageRepository.create(packages);
  }

  @get('/packaging/count', {
    responses: {
      '200': {
        description: 'Package model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Package)) where?: Where,
  ): Promise<Count> {
    return await this.packageRepository.count(where);
  }

  @get('/packaging', {
    responses: {
      '200': {
        description: 'Array of Package model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Package } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Package)) filter?: Filter,
  ): Promise<Package[]> {
    return await this.packageRepository.find(filter);
  }

  @patch('/packaging', {
    responses: {
      '200': {
        description: 'Package PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() packages: Package,
    @param.query.object('where', getWhereSchemaFor(Package)) where?: Where,
  ): Promise<Count> {
    return await this.packageRepository.updateAll(packages, where);
  }

  @get('/packaging/{id}', {
    responses: {
      '200': {
        description: 'Package model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Package } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Package> {
    return await this.packageRepository.findById(id);
  }

  @patch('/packaging/{id}', {
    responses: {
      '204': {
        description: 'Package PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() packages: Package,
  ): Promise<void> {
    await this.packageRepository.updateById(id, packages);
  }

  @del('/packaging/{id}', {
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
