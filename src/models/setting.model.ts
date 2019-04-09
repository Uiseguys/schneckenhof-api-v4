import { model, Entity, property } from '@loopback/repository';

@model()
export class Setting extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  key: string;

  @property({
    type: 'object',
    default: {},
  })
  value?: object;

  @property({
    type: 'number',
    required: true,
    id: true,
    default: 0,
  })
  id: number;

  constructor(data?: Partial<Setting>) {
    super(data);
  }
}
