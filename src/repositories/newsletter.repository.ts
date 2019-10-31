import {DefaultCrudRepository} from '@loopback/repository';
import {Newsletter, NewsletterRelations} from '../models';
import {PostgresdbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class NewsletterRepository extends DefaultCrudRepository<
  Newsletter,
  typeof Newsletter.prototype.id,
  NewsletterRelations
> {
  constructor(
    @inject('datasources.postgresdb') dataSource: PostgresdbDataSource,
  ) {
    super(Newsletter, dataSource);
  }
}
