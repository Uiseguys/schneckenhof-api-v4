/// <reference types="express" />
import { Count, Filter, Where } from '@loopback/repository';
import { Response, Request } from '@loopback/rest';
import { Setting } from '../models';
import { SettingRepository } from '../repositories';
import { UserProfile } from '@loopback/security';
export declare class SettingController {
    settingRepository: SettingRepository;
    private user;
    constructor(settingRepository: SettingRepository, user: UserProfile);
    upsertWithWhere(request: Request, response: Response, where?: Where): Promise<void>;
    count(where?: Where): Promise<Count>;
    find(filter?: Filter): Promise<Setting[]>;
    updateById(id: number, setting: Setting): Promise<void>;
    upsertWithWheres(request: Request, response: Response, where?: Where): Promise<void>;
    deleteById(id: number): Promise<void>;
}
