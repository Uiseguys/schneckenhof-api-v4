import {Entity, model, property} from '@loopback/repository';

@model()
export class Logs extends Entity {
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
    type: 'date',
  })
  OverallResponseTime?: string;

  @property({
    type: 'string',
  })
  msg?: string;

  @property({
    type: 'date',
  })
  time?: string;

  constructor(data?: Partial<Logs>) {
    super(data);
  }
}
