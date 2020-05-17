import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: true}})
export class News extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'date',
    required: true,
  })
  relevantFrom: string;

  @property({
    type: 'date',
    required: true,
  })
  relevantTo: string;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
  })
  shortDescription?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
    default: '',
  })
  homePageDescription?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  showOnHome?: boolean;

  @property({
    type: 'date',
    required: true,
  })
  startDate: string;

  @property({
    type: 'date',
    required: true,
  })
  endDate: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<News>) {
    super(data);
  }
}

export interface NewsRelations {
  // describe navigational properties here
}

export type NewsWithRelations = News & NewsRelations;
