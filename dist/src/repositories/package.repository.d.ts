import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { Package } from '../models';
export declare class PackageRepository extends DefaultCrudRepository<Package, typeof Package.prototype.id> {
    constructor(dataSource: juggler.DataSource);
}
