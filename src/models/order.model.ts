import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Order extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    default: '',
  })
  total: string;

  @property({
    type: 'object',
  })
  details?: object;

  @property({
    type: 'date',
    default: '$now',
  })
  created: string;

  @property({
    type: 'date',
  })
  completed?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {
  // describe navigational properties here
}

export type OrderWithRelations = Order & OrderRelations;
