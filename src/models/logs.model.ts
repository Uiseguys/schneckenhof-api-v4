import {Entity, model, property} from '@loopback/repository';

@model()
export class Logs extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
    default: 0
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  hostname: string;

  @property({
    type: 'string',
    required: true,
  })
  url: string;

  @property({
    type: 'object',
  })
  APIResponseTime?: object;

  @property({
    type: 'string',
  })
  OverallResponseTime?: string;

  @property({
    type: 'string',
  })
  msg?: string;

  @property({
    type: 'date',
  })
  time?: Date;

  constructor(data?: Partial<Logs>) {
    super(data);
  }
}
