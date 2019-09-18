import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { Logs } from '../models';
export declare class LogsRepository extends DefaultCrudRepository<Logs, typeof Logs.prototype.id> {
    constructor(dataSource: juggler.DataSource);
}
