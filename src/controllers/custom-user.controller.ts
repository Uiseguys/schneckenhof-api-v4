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
  RestBindings,
  Response,
  Request
} from '@loopback/rest';

import {inject} from '@loopback/context';

import { CustomUser } from '../models';
import { UserRepository } from '../repositories';
import { AuthenticationBindings, authenticate } from '@loopback/authentication';
import { UserProfile } from '@loopback/security';

const bcrypt = require('bcrypt');

export class CustomUserController {

  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(AuthenticationBindings.CURRENT_USER, {optional: true}) private user: UserProfile
  ) { }

  @authenticate('BasicStrategy')

  @post('/CustomUsers', {
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

  @get('/CustomUsers/count', {
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

  @get('/CustomUsers', {
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

  @patch('/CustomUsers', {
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

  @get('/CustomUsers/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: { 'application/json': { schema: { 'x-ts-type': CustomUser } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Object> {
    
    return await this.userRepository.find({where: {id: id}});
  }

  @patch('/CustomUsers/{id}', {
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

  @del('/CustomUsers/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }

  @post('CustomUsers/login', {
    responses: {
      '200': {
        description: 'User login success',
        content: { 'application/json': { schema: { 'x-ts-type': CustomUser } } },
      },
    },
  })
  async login(@requestBody({}
  )@inject(RestBindings.Http.REQUEST) request: Request,@inject(RestBindings.Http.RESPONSE) response: Response): Promise<Object> {
    return new Promise<object>((resolve, reject) => {
      this.userRepository.find({where: {email: request.body.email}},
      function(err:any,userInstance:any){
         if(userInstance.length>0){
          bcrypt.compare(request.body.password, userInstance[0].password, function (err:any, match:any) {
            if (match) {
              resolve(userInstance[0]);
            } else {
              let msg = {
                error: {
                  message: "login failed"
                }
              }
              resolve(response.status(401).send(msg));
            }
          });
         }else{
           let msg = {error:{
              message:"login failed"
           }}
          resolve(response.status(401).send(msg));
         }
      }) 
    });
   
  }

  @post('/CustomUsers/logout', {
    responses: {
      '200': {
        description: 'User logout success',
        content: { 'application/json': { schema: { 'x-ts-type': {} } } },
      },
    },
  })
  async logout(@requestBody()@inject(RestBindings.Http.REQUEST) request: Request,@inject(RestBindings.Http.RESPONSE) response: Response): Promise<void> {
     
  }

}
