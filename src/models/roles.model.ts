import { Model, model, Entity, property } from '@loopback/repository';

@model()
export class Roles extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
    default: 0,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'date',
    required: true,
  })
  created: string;

  @property({
    type: 'date',
    required: true,
  })
  modified: string;

  constructor(data?: Partial<Roles>) {
    super(data);
  }
}
