import {DefaultCrudRepository} from '@loopback/repository';
import {CustomUser, CustomUserRelations} from '../models';
import {PostgresdbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CustomUserRepository extends DefaultCrudRepository<
  CustomUser,
  typeof CustomUser.prototype.id,
  CustomUserRelations
> {
  constructor(
    @inject('datasources.postgresdb') dataSource: PostgresdbDataSource,
  ) {
    super(CustomUser, dataSource);
  }
}
