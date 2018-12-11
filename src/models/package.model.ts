import { Model, model, property, Entity } from '@loopback/repository';

@model()
export class Package extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  displayName: string;

  @property({
    type: 'number',
    required: true,
    default: 0,
  })
  measure: number;

  @property({
    type: 'string',
    required: true
  })
  unitOfMeasure: string;

  @property({
    type: 'number',
    required: true,
    id: true
  })
  id: number;

  constructor(data?: Partial<Package>) {
    super(data);
  }
}
