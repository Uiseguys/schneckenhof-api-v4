import { Count, Filter, Where } from '@loopback/repository';
import { Package } from '../models';
import { PackageRepository } from '../repositories';
import { UserProfile } from '@loopback/security';
export declare class PackageController {
    packageRepository: PackageRepository;
    private user;
    constructor(packageRepository: PackageRepository, user: UserProfile);
    create(packages: Package): Promise<Package>;
    count(where?: Where): Promise<Count>;
    find(filter?: Filter): Promise<Package[]>;
    findById(id: number): Promise<Package>;
    updateById(id: number, packages: Package): Promise<void>;
    deleteById(id: number): Promise<void>;
}
