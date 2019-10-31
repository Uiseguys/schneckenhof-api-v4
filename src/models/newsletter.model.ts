import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Newsletter extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    index: {unique: true},
  })
  email: string;

  @property({
    type: 'boolean',
    default: true,
  })
  subscribed?: boolean;

  @property({
    type: 'string',
  })
  unsubscribe_hash?: string;

  @property({
    type: 'date',
    default: '$now',
  })
  create_time?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Newsletter>) {
    super(data);
  }
}

export interface NewsletterRelations {
  // describe navigational properties here
}

export type NewsletterWithRelations = Newsletter & NewsletterRelations;
