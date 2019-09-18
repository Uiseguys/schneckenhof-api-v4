import { DefaultCrudRepository, juggler, BelongsToAccessor } from '@loopback/repository';
import { Wine, Package } from '../models';
import { Getter } from '@loopback/core';
import { PackageRepository } from '../repositories';
export declare class WineRepository extends DefaultCrudRepository<Wine, typeof Wine.prototype.id> {
    protected packageRepositoryGetter: Getter<PackageRepository>;
    readonly packaging: BelongsToAccessor<Package, typeof Wine.prototype.id>;
    constructor(dataSource: juggler.DataSource, packageRepositoryGetter: Getter<PackageRepository>);
}
