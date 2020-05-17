import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: true}})
export class Payment extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  pay_method: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Payment>) {
    super(data);
  }
}

export interface PaymentRelations {
  // describe navigational properties here
}

export type PaymentWithRelations = Payment & PaymentRelations;
