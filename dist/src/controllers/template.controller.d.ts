/// <reference types="express" />
import { Count, Filter, Where } from '@loopback/repository';
import { Request, Response } from '@loopback/rest';
import { Template } from '../models';
import { TemplateRepository } from '../repositories';
import { UserProfile } from '@loopback/security';
export declare class TemplateController {
    templateRepository: TemplateRepository;
    private user;
    constructor(templateRepository: TemplateRepository, user: UserProfile);
    upload(request: Request, response: Response): Promise<object>;
    count(where?: Where): Promise<Count>;
    find(filter?: Filter): Promise<Template[]>;
    findById(id: number): Promise<Template>;
}
