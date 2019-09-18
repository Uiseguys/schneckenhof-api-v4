import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { Setting } from '../models';
export declare class SettingRepository extends DefaultCrudRepository<Setting, typeof Setting.prototype.id> {
    constructor(dataSource: juggler.DataSource);
}
