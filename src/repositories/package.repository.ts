import {DefaultCrudRepository} from '@loopback/repository';
import {Package, PackageRelations} from '../models';
import {PostgresdbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class PackageRepository extends DefaultCrudRepository<
  Package,
  typeof Package.prototype.id,
  PackageRelations
> {
  constructor(
    @inject('datasources.postgresdb') dataSource: PostgresdbDataSource,
  ) {
    super(Package, dataSource);
  }
}
