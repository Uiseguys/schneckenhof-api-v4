import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { CustomUser } from '../models';
export declare class UserRepository extends DefaultCrudRepository<CustomUser, typeof CustomUser.prototype.id> {
    constructor(dataSource: juggler.DataSource);
}
