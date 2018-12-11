import {Entity, model, property} from '@loopback/repository';

@model()
export class Resource extends Entity {
  @property({
    type: 'number',
    id: true,
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

  constructor(data?: Partial<Resource>) {
    super(data);
  }
}
