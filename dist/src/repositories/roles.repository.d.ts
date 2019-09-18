import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { Roles } from '../models';
export declare class RolesRepository extends DefaultCrudRepository<Roles, typeof Roles.prototype.id> {
    constructor(dataSource: juggler.DataSource);
}
