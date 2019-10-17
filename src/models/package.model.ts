import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Package extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
  })
  displayName?: string;

  @property({
    type: 'number',
    required: true,
    default: 0,
  })
  measure: number;

  @property({
    type: 'string',
    required: true,
  })
  unitOfMeasure: string;

  idInjection: false;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Package>) {
    super(data);
  }
}

export interface PackageRelations {
  // describe navigational properties here
}

export type PackageWithRelations = Package & PackageRelations;
