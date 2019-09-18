import { Entity } from '@loopback/repository';
export declare class Payment extends Entity {
    pay_method: string;
    constructor(data?: Partial<Payment>);
}
