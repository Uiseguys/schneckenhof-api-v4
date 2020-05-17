import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: true}})
export class Resource extends Entity {
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
  resourceId: string;

  @property({
    type: 'string',
  })
  weblinkUrl?: string;

  @property({
    type: 'string',
    required: true,
  })
  originalFilename: string;

  @property({
    type: 'string',
  })
  type?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Resource>) {
    super(data);
  }
}

export interface ResourceRelations {
  // describe navigational properties here
}

export type ResourceWithRelations = Resource & ResourceRelations;
