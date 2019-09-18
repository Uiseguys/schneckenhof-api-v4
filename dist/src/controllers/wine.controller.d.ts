/// <reference types="express" />
import { Count, Filter, Where } from '@loopback/repository';
import { Response, Request } from '@loopback/rest';
import { Wine } from '../models';
import { WineRepository } from '../repositories';
import { PackageRepository } from '../repositories';
import { UserProfile } from '@loopback/security';
export declare class WineController {
    wineRepository: WineRepository;
    packageRepository: PackageRepository;
    private user;
    constructor(wineRepository: WineRepository, packageRepository: PackageRepository, user: UserProfile);
    create(wine: Wine, request: Request, response: Response): Promise<Wine>;
    count(where?: Where): Promise<Count>;
    find(filter?: Filter): Promise<object>;
    updateAll(wine: Wine, where?: Where): Promise<Count>;
    findById(id: number): Promise<Wine>;
    updateById(id: number, wine: Wine): Promise<void>;
    deleteById(id: number): Promise<void>;
}
