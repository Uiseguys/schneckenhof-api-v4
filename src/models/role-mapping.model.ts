import {Entity, model, property} from '@loopback/repository';

@model()
export class RoleMapping extends Entity {
  @property({
    type: 'number',
    id: true,
    default:0
  })
  id?: number;

  @property({
    type: 'string',
  })
  principalType?: string;

  @property({
    type: 'number',
    required: true,
  })
  principalId: number;

  @property({
    type: 'number',
    required: true,
  })
  roleId: number;

  constructor(data?: Partial<RoleMapping>) {
    super(data);
  }
}
