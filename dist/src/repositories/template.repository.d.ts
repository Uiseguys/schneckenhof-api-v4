import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { Template } from '../models';
export declare class TemplateRepository extends DefaultCrudRepository<Template, typeof Template.prototype.id> {
    constructor(dataSource: juggler.DataSource);
}
