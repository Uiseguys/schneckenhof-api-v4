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
import {Template} from '../models';
import {TemplateRepository} from '../repositories';

export class TemplateController {
  constructor(
    @repository(TemplateRepository)
    public templateRepository : TemplateRepository,
  ) {}

  @post('/templates', {
    responses: {
      '200': {
        description: 'Template model instance',
        content: {'application/json': {schema: {'x-ts-type': Template}}},
      },
    },
  })
  async create(@requestBody() template: Template): Promise<Template> {
    return await this.templateRepository.create(template);
  }

  @get('/templates/count', {
    responses: {
      '200': {
        description: 'Template model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Template)) where?: Where,
  ): Promise<Count> {
    return await this.templateRepository.count(where);
  }

  @get('/templates', {
    responses: {
      '200': {
        description: 'Array of Template model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Template}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Template)) filter?: Filter,
  ): Promise<Template[]> {
    return await this.templateRepository.find(filter);
  }

  @patch('/templates', {
    responses: {
      '200': {
        description: 'Template PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() template: Template,
    @param.query.object('where', getWhereSchemaFor(Template)) where?: Where,
  ): Promise<Count> {
    return await this.templateRepository.updateAll(template, where);
  }

  @get('/templates/{id}', {
    responses: {
      '200': {
        description: 'Template model instance',
        content: {'application/json': {schema: {'x-ts-type': Template}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Template> {
    return await this.templateRepository.findById(id);
  }

  @patch('/templates/{id}', {
    responses: {
      '204': {
        description: 'Template PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() template: Template,
  ): Promise<void> {
    await this.templateRepository.updateById(id, template);
  }

  @del('/templates/{id}', {
    responses: {
      '204': {
        description: 'Template DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.templateRepository.deleteById(id);
  }
}
