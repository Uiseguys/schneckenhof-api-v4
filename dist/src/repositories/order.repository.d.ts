import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { Order } from '../models';
export declare class OrderRepository extends DefaultCrudRepository<Order, typeof Order.prototype.id> {
    constructor(dataSource: juggler.DataSource);
}
