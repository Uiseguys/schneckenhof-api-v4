// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { DefaultCrudRepository, juggler,repository, BelongsToAccessor} from '@loopback/repository';
import { Wine,Package } from '../models';
import {Getter, inject } from '@loopback/core';
import {PackageRepository} from '../repositories';

export class WineRepository extends DefaultCrudRepository<
  Wine,
  typeof Wine.prototype.id
  > {

   public readonly packaging: BelongsToAccessor<
    Package,
    typeof Wine.prototype.id
  >;
  constructor(@inject('datasources.db') dataSource: juggler.DataSource,@repository.getter('PackageRepository')
  protected packageRepositoryGetter: Getter<PackageRepository>) {
    super(Wine, dataSource);
    this.packaging = this.createBelongsToAccessorFor(
      'packaging',
      packageRepositoryGetter,
    );
  }
}



