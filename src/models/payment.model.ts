import {Entity, model, property} from '@loopback/repository';

@model()
export class Payment extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  pay_method: string;

  constructor(data?: Partial<Payment>) {
    super(data);
  }

}
