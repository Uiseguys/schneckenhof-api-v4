import {DefaultCrudRepository} from '@loopback/repository';
import {Template, TemplateRelations} from '../models';
import {PostgresdbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TemplateRepository extends DefaultCrudRepository<
  Template,
  typeof Template.prototype.id,
  TemplateRelations
> {
  constructor(
    @inject('datasources.postgresdb') dataSource: PostgresdbDataSource,
  ) {
    super(Template, dataSource);
  }
}
