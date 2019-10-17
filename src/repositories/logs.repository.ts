import {DefaultCrudRepository} from '@loopback/repository';
import {Logs, LogsRelations} from '../models';
import {PostgresdbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class LogsRepository extends DefaultCrudRepository<
  Logs,
  typeof Logs.prototype.id,
  LogsRelations
> {
  constructor(
    @inject('datasources.postgresdb') dataSource: PostgresdbDataSource,
  ) {
    super(Logs, dataSource);
  }
}
