import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Logs extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

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
  time?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Logs>) {
    super(data);
  }
}

export interface LogsRelations {
  // describe navigational properties here
}

export type LogsWithRelations = Logs & LogsRelations;
