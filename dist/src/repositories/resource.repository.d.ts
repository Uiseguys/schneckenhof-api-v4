import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { Resource } from '../models';
export declare class ResourceRepository extends DefaultCrudRepository<Resource, typeof Resource.prototype.id> {
    constructor(dataSource: juggler.DataSource);
}
