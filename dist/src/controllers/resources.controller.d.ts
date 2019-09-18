/// <reference types="express" />
import { Count, Filter, Where } from '@loopback/repository';
import { Response, Request } from '@loopback/rest';
import { Resource } from '../models';
import { ResourceRepository } from '../repositories';
import { UserProfile } from '@loopback/security';
export declare class ResourcesController {
    resourceRepository: ResourceRepository;
    private user;
    constructor(resourceRepository: ResourceRepository, user: UserProfile);
    create(request: Request, response: Response): Promise<object>;
    count(where?: Where): Promise<Count>;
    find(filter?: Filter): Promise<Resource[]>;
    findById(id: number): Promise<Resource>;
    deleteById(id: number): Promise<void>;
}
