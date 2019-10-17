import {DefaultCrudRepository} from '@loopback/repository';
import {Resource, ResourceRelations} from '../models';
import {PostgresdbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ResourceRepository extends DefaultCrudRepository<
  Resource,
  typeof Resource.prototype.id,
  ResourceRelations
> {
  constructor(
    @inject('datasources.postgresdb') dataSource: PostgresdbDataSource,
  ) {
    super(Resource, dataSource);
  }
}
