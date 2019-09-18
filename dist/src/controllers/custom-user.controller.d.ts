/// <reference types="express" />
import { Count, Filter, Where } from '@loopback/repository';
import { Response, Request } from '@loopback/rest';
import { CustomUser } from '../models';
import { UserRepository } from '../repositories';
import { UserProfile } from '@loopback/security';
export declare class CustomUserController {
    userRepository: UserRepository;
    private user;
    constructor(userRepository: UserRepository, user: UserProfile);
    create(user: CustomUser): Promise<CustomUser>;
    count(where?: Where): Promise<Count>;
    find(filter?: Filter): Promise<CustomUser[]>;
    updateAll(user: CustomUser, where?: Where): Promise<Count>;
    findById(id: number): Promise<Object>;
    updateById(id: number, user: CustomUser): Promise<void>;
    deleteById(id: number): Promise<void>;
    login(request: Request, response: Response): Promise<Object>;
    logout(request: Request, response: Response): Promise<void>;
}
