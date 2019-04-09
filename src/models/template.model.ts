import {Entity, model, property} from '@loopback/repository';

@model()
export class Template extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
    default:0
  })
  id: number;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  originalFilename?: string;

  constructor(data?: Partial<Template>) {
    super(data);
  }
}
