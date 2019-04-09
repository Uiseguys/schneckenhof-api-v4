import { Entity, model, property, RepositoryMixin, RepositoryMixinDoc } from '@loopback/repository';

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
    type: 'string',
    required: true,
    default: '',
  })
  total: string;

  @property({
    type: 'number',
    id: true,
    required: true,
    default:0
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
  created: Date;

  @property({
    type: 'date',
  })
  completed?: Date;

  constructor(data?: Partial<Order>) {
    super(data);
  }
}
