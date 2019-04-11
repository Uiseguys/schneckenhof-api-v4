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
import { inject } from '@loopback/context';
import { Wine } from '../models';
import { WineRepository } from '../repositories';
import { PackageRepository } from '../repositories';
import {
  AuthenticationBindings,
  UserProfile,
  authenticate,
} from '@loopback/authentication';

export class WineController {
  constructor(
    @repository(WineRepository)
    public wineRepository: WineRepository,
    @repository(PackageRepository)
    public packageRepository: PackageRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true }) private user: UserProfile
  ) { }

  @authenticate('BasicStrategy')
  @post('/Wines', {
    responses: {
      '200': {
        description: 'Wine model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Wine } } },
      },
    },
  })
  async create(@requestBody() wine: Wine, @inject(RestBindings.Http.REQUEST) request: Request, @inject(RestBindings.Http.RESPONSE) response: Response): Promise<Wine> {
    wine.id = Math.floor(1000 + Math.random() * 9000);
    return await this.wineRepository.create(wine);
  }


  @authenticate('BasicStrategy')
  @get('/Wines/count', {
    responses: {
      '200': {
        description: 'Wine model count',
        content: { 'application/json': { schema: CountSchema } },
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
            schema: { type: 'array', items: { 'x-ts-type': Wine } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Wine)) filter?: Filter,
  ): Promise<object> {
    let self = this
    let packagingData: any = [];
    return new Promise<object>((resolve, reject) => {
      this.wineRepository.find(filter, function (err: any, wine: any) {
        if (err) {
          reject(err)
        } else {
          self.packageRepository.find({}, function (err: any, packaging: any) {
            if (err) {
              reject(err)
            } else {
              packagingData = packaging;
              for (let i = 0; i < wine.length; i++) {
                let index= packagingData.findIndex((x:any)=> x.id ==  wine[i].packagingId);
                if(index > -1){
                  wine[i]['packaging']= packagingData[index];
                }
              }
              resolve(wine);
            }
          });
        }
      })
    });
    /*this.wineRepository.find(filter,function(err:any,wine:any){ 
     let winedata:any = {};
     if(wine.length>0){
         for(let i=0; i<wine.length; i++){
            self.packageRepository.find({where: {id: wine[i].packagingId}},function(err:any, packaging:any){
                 //console.log(packaging);
                 wine[i]["packaging"] = packaging[0];
                 console.log(wine[i]);
            })
         }
      }
    });
    return await this.wineRepository.find(filter);*/

  }


  @patch('/Wines', {
    responses: {
      '200': {
        description: 'Wine PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
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
        content: { 'application/json': { schema: { 'x-ts-type': Wine } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Wine> {
    return await this.wineRepository.findById(id);
  }

  @authenticate('BasicStrategy')
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

  @authenticate('BasicStrategy')
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
