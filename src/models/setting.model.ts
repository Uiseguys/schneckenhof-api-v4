import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Setting extends Entity {
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
  key: string;

  @property({
    type: 'object',
    default: {},
  })
  value?: object;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Setting>) {
    super(data);
  }
}

export interface SettingRelations {
  // describe navigational properties here
}

export type SettingsWithRelations = Setting & SettingRelations;
