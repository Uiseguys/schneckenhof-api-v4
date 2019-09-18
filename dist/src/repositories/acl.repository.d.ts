import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { Acl } from '../models';
export declare class AclRepository extends DefaultCrudRepository<Acl, typeof Acl.prototype.id> {
    constructor(dataSource: juggler.DataSource);
}
