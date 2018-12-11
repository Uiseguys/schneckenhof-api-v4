// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { Package } from '../models';
import { inject } from '@loopback/core';

export class PackageRepository extends DefaultCrudRepository<
  Package,
  typeof Package.prototype.id
  > {
  constructor(@inject('datasources.db') dataSource: juggler.DataSource) {
    super(Package, dataSource);
  }
}