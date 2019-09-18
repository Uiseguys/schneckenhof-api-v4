import { Entity } from '@loopback/repository';
export declare class Order extends Entity {
    type: string;
    email: string;
    total: string;
    id: number;
    details?: object;
    created: Date;
    completed?: Date;
    constructor(data?: Partial<Order>);
}
