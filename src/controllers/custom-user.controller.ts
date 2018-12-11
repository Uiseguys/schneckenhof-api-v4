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

import { CustomUser } from '../models';
import { UserRepository } from '../repositories';
const bcrypt = require('bcrypt');

export class CustomUserController {

  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @post('/CustomUser', {
    responses: {
      '200': {
        description: 'User model instance',
        content: { 'application/json': { schema: { 'x-ts-type': CustomUser } } },
      },
    },
  })
  async create(@requestBody() user: CustomUser): Promise<CustomUser> {
    user.password = bcrypt.hashSync(user.password, 10);
    return await this.userRepository.create(user);
  }

  @get('/CustomUser/count', {
    responses: {
      '200': {
        description: 'User model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(CustomUser)) where?: Where,
  ): Promise<Count> {
    return await this.userRepository.count(where);
  }

  @get('/CustomUser', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': CustomUser } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(CustomUser)) filter?: Filter,
  ): Promise<CustomUser[]> {
    return await this.userRepository.find(filter);
  }

  @patch('/CustomUser', {
    responses: {
      '200': {
        description: 'User PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() user: CustomUser,
    @param.query.object('where', getWhereSchemaFor(CustomUser)) where?: Where,
  ): Promise<Count> {
    return await this.userRepository.updateAll(user, where);
  }

  @get('/CustomUser/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: { 'application/json': { schema: { 'x-ts-type': CustomUser } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<CustomUser> {
    return await this.userRepository.findById(id);
  }

  @patch('/CustomUser/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() user: CustomUser,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @del('/CustomUser/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
