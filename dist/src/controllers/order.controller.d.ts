import { Count, Filter, Where } from '@loopback/repository';
import { Order } from '../models';
import { OrderRepository } from '../repositories';
import { UserProfile } from '@loopback/security';
export declare class OrderController {
    orderRepository: OrderRepository;
    private user;
    constructor(orderRepository: OrderRepository, user: UserProfile);
    count(where?: Where): Promise<Count>;
    find(filter?: Filter): Promise<Order[]>;
    findById(id: number): Promise<Order>;
    deleteById(id: number): Promise<void>;
}
