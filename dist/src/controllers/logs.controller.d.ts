import { Count, Filter, Where } from '@loopback/repository';
import { Logs } from '../models';
import { LogsRepository } from '../repositories';
export declare class LogsController {
    logsRepository: LogsRepository;
    constructor(logsRepository: LogsRepository);
    create(logs: Logs): Promise<Logs>;
    count(where?: Where): Promise<Count>;
    find(filter?: Filter): Promise<Logs[]>;
    updateAll(logs: Logs, where?: Where): Promise<Count>;
    findById(id: number): Promise<Logs>;
    updateById(id: number, logs: Logs): Promise<void>;
    deleteById(id: number): Promise<void>;
}
