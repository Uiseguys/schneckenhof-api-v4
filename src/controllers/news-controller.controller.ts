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
import {inject} from '@loopback/context';
import {News} from '../models';
import {NewsRepository} from '../repositories';
import { AuthenticationBindings, authenticate } from '@loopback/authentication';
import { UserProfile } from '@loopback/security';

export class NewsControllerController {
  constructor(
    @repository(NewsRepository)
    public newsRepository : NewsRepository,
    @inject(AuthenticationBindings.CURRENT_USER, {optional: true}) private user: UserProfile

  ) {}
  @authenticate('BasicStrategy')
  @post('/News', {
    responses: {
      '200': {
        description: 'News model instance',
        content: {'application/json': {schema: {'x-ts-type': News}}},
      },
    },
  })
  async create(@requestBody() news: News): Promise<News> {
    news.id = Math.floor(1000 + Math.random() * 9000);
    return await this.newsRepository.create(news);
  }

  @get('/News/count', {
    responses: {
      '200': {
        description: 'News model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(News)) where?: Where,
  ): Promise<Count> {
    return await this.newsRepository.count(where);
  }

  @get('/News', {
    responses: {
      '200': {
        description: 'Array of News model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': News}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(News)) filter?: Filter,
  ): Promise<News[]> {
    return await this.newsRepository.find(filter);
  }

  @authenticate('BasicStrategy')
  @patch('/News', {
    responses: {
      '200': {
        description: 'News PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() news: News,
    @param.query.object('where', getWhereSchemaFor(News)) where?: Where,
  ): Promise<Count> {
    return await this.newsRepository.updateAll(news, where);
  }

  @get('/News/{id}', {
    responses: {
      '200': {
        description: 'News model instance',
        content: {'application/json': {schema: {'x-ts-type': News}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<News> {
    return await this.newsRepository.findById(id);
  }

  @authenticate('BasicStrategy')
  @patch('/News/{id}', {
    responses: {
      '204': {
        description: 'News PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() news: News,
  ): Promise<void> {
    await this.newsRepository.updateById(id, news);
  }

  @authenticate('BasicStrategy')
  @del('/News/{id}', {
    responses: {
      '204': {
        description: 'News DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.newsRepository.deleteById(id);
  }
}
