import { Entity, model, property } from '@loopback/repository';

@model()
export class Order extends Entity {
  @property({
    type: 'string',
    required: true
  })
  type: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'number',
    required: true,
    default: 0,
  })
  total: number;

  @property({
    type: 'number',
    id: true,
    required: true,
  })
  id: number;

  @property({
    type: 'object',
  })
  details?: object;

  @property({
    type: 'date',
    required: true,
  })
  created: string;

  @property({
    type: 'date',
  })
  completed?: string;

  constructor(data?: Partial<Order>) {
    super(data);
  }
}