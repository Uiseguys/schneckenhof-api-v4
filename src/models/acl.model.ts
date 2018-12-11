import {Entity, model, property} from '@loopback/repository';

@model()
export class Acl extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
  })
  id: number;

  @property({
    type: 'string',
  })
  model?: string;

  @property({
    type: 'string',
  })
  property?: string;

  @property({
    type: 'string',
  })
  accessType?: string;

  @property({
    type: 'string',
    required: true,
  })
  permission: string;

  @property({
    type: 'string',
  })
  principalType?: string;

  @property({
    type: 'string',
    required: true,
  })
  principalId: string;

  constructor(data?: Partial<Acl>) {
    super(data);
  }
}
