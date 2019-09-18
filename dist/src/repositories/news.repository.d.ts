import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { News } from '../models';
export declare class NewsRepository extends DefaultCrudRepository<News, typeof News.prototype.id> {
    constructor(dataSource: juggler.DataSource);
}
