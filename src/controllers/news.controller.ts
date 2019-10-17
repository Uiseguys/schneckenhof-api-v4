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
import {inject} from '@loopback/context';
import {News} from '../models';
import {NewsRepository} from '../repositories';
import {AuthenticationBindings, authenticate} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';

export class NewsController {
  constructor(
    @repository(NewsRepository)
    public newsRepository: NewsRepository,
    @inject(AuthenticationBindings.CURRENT_USER, {optional: true})
    private user: UserProfile,
  ) {}

  @authenticate('BasicStrategy')
  @post('/news', {
    responses: {
      '200': {
        description: 'News model instance',
        content: {'application/json': {schema: getModelSchemaRef(News)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(News, {
            title: 'NewNews',
            exclude: ['id'],
          }),
        },
      },
    })
    news: Omit<News, 'id'>,
  ): Promise<News> {
    return this.newsRepository.create(news);
  }

  @get('/news/count', {
    responses: {
      '200': {
        description: 'News model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(News)) where?: Where<News>,
  ): Promise<Count> {
    return this.newsRepository.count(where);
  }

  @get('/news', {
    responses: {
      '200': {
        description: 'Array of News model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(News)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(News))
    filter?: Filter<News>,
  ): Promise<News[]> {
    return this.newsRepository.find(filter);
  }

  @authenticate('BasicStrategy')
  @patch('/news', {
    responses: {
      '200': {
        description: 'News PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(News, {partial: true}),
        },
      },
    })
    news: News,
    @param.query.object('where', getWhereSchemaFor(News)) where?: Where<News>,
  ): Promise<Count> {
    return this.newsRepository.updateAll(news, where);
  }

  @get('/news/{id}', {
    responses: {
      '200': {
        description: 'News model instance',
        content: {'application/json': {schema: getModelSchemaRef(News)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<News> {
    return this.newsRepository.findById(id);
  }

  @authenticate('BasicStrategy')
  @patch('/news/{id}', {
    responses: {
      '204': {
        description: 'News PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(News, {partial: true}),
        },
      },
    })
    news: News,
  ): Promise<void> {
    await this.newsRepository.updateById(id, news);
  }

  @authenticate('BasicStrategy')
  @put('/news/{id}', {
    responses: {
      '204': {
        description: 'News PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() news: News,
  ): Promise<void> {
    await this.newsRepository.replaceById(id, news);
  }

  @authenticate('BasicStrategy')
  @del('/news/{id}', {
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
