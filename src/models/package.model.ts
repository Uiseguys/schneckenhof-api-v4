import { Model, model, property, Entity } from '@loopback/repository';

@model()
export class Package extends Entity {
  @property({
    type: 'string',
    required: false,
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
    id: true,
    default:0
  })
  id: number;

  idInjection: false

  constructor(data?: Partial<Package>) {
    super(data);
  }
}
