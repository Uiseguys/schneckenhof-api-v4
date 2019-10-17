import {DefaultCrudRepository} from '@loopback/repository';
import {News, NewsRelations} from '../models';
import {PostgresdbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class NewsRepository extends DefaultCrudRepository<
  News,
  typeof News.prototype.id,
  NewsRelations
> {
  constructor(
    @inject('datasources.postgresdb') dataSource: PostgresdbDataSource,
  ) {
    super(News, dataSource);
  }
}
