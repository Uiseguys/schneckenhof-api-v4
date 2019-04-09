import { Model, model, Entity, property,belongsTo } from '@loopback/repository';
import {Package} from './package.model';

@model({settings: {strict: false}})

export class Wine extends Entity {
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
    id: true,
    default:0
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
    default: 0,
    postgresql: {
      dataType: "NUMERIC(10,2)"
    }
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
    default: 0,
  })
  no: number;

  @property({
    type: 'number',
    required: true,
    default: 0,
    postgresql: {
      dataType: "NUMERIC(10,2)"
    }
  })
  alcohol: number;

  @property({
    type: 'string'
  })
  description: string;

  @belongsTo(() => Package)
  packagingId: number;

  constructor(data?: Partial<Wine>) {
    super(data);
  }
}
