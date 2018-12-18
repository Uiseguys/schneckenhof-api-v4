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
  Response,
  Request,
  RestBindings
} from '@loopback/rest';
import {inject} from '@loopback/context';
import {Wine} from '../models';
import {WineRepository} from '../repositories';

export class WineController {
  constructor(
    @repository(WineRepository)
    public wineRepository : WineRepository,
  ) {}

  @post('/Wines', {
    responses: {
      '200': {
        description: 'Wine model instance',
        content: {'application/json': {schema: {'x-ts-type': Wine}}},
      },
    },
  })
  async create(@requestBody() wine: Wine,@inject(RestBindings.Http.REQUEST) request: Request,@inject(RestBindings.Http.RESPONSE) response: Response): Promise<Wine> {
    wine.packagingId = parseInt(request.body.packagingId);
    if(request.body.premium){
       wine.premium = true
    }else{
      wine.premium = false
    }
    if(!request.body.content){
      wine.content = 0
    }else{
      wine.content = 1
    }
    if(request.body.availability){
      wine.availability = true
    }else{
      wine.availability = false
    }
    wine.id = Math.floor(1000 + Math.random() * 9000);

    console.log(wine);
    
    return await this.wineRepository.create(wine);
  }

  @get('/Wines/count', {
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

  @get('/Wines', {
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

  @patch('/Wines', {
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

  @get('/Wines/{id}', {
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

  @patch('/Wines/{id}', {
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

  @del('/Wines/{id}', {
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
