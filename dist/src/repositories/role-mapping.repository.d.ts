import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { RoleMapping } from '../models';
export declare class RoleMappingRepository extends DefaultCrudRepository<RoleMapping, typeof RoleMapping.prototype.id> {
    constructor(dataSource: juggler.DataSource);
}
