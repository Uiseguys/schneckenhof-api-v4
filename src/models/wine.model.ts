import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Package} from './package.model';

@model({settings: {strict: false}})
export class Wine extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'number',
    default: 0,
  })
  vintage?: number;

  @property({
    type: 'number',
    required: true,
    default: 0,
    postgresql: {
      dataType: 'NUMERIC(10,2)',
    },
  })
  price: number;

  @property({
    type: 'string',
  })
  awardText?: string;

  @property({
    type: 'string',
  })
  awardLevel?: string;

  @property({
    type: 'string',
    required: true,
  })
  image: string;

  @property({
    type: 'boolean',
    required: true,
    default: true,
  })
  availability: boolean;

  @property({
    type: 'number',
    required: true,
    default: 0,
    postgresql: {
      dataType: 'NUMERIC(10,2)',
    },
  })
  content: number;

  @property({
    type: 'string',
  })
  varietal?: string;

  @property({
    type: 'boolean',
    default: true,
  })
  premium?: boolean;

  @property({
    type: 'number',
    required: true,
    default: 0,
  })
  priority: number;

  @property({
    type: 'number',
    required: true,
    default: 0,
  })
  no: number;

  @property({
    type: 'number',
    required: true,
    default: 0,
    postgresql: {
      dataType: 'NUMERIC(10,2)',
    },
  })
  alcohol: number;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @belongsTo(() => Package)
  packagingId: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Wine>) {
    super(data);
  }
}

export interface WineRelations {
  // describe navigational properties here
}

export type WineWithRelations = Wine & WineRelations;
