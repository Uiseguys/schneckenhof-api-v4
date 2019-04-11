// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Entity, model, property } from '@loopback/repository';

@model()
export class CustomUser extends Entity {
  @property({
    type: 'object',
    default: {},
  })
  settings?: object;

  @property({
    type: 'number',
    id: true,
    required: true,
    default: 0
  })
  id?: number;

  @property({
    type: 'string',
  })
  realm?: string;

  @property({
    type: 'string',
    id: true,
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'boolean',
    default: false,
  })
  emailVerified?: boolean;

  @property({
    type: 'string',
    default: null,
  })
  verificationToken?: string;


  constructor(data?: Partial<CustomUser>) {
    super(data);
  }
}
