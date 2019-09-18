/// <reference types="express" />
import { Response, Request } from '@loopback/rest';
import { Payment } from '../models';
import { OrderRepository } from '../repositories';
import { SettingRepository } from '../repositories';
import { UserProfile } from '@loopback/security';
export declare class PaymentController {
    orderRepository: OrderRepository;
    settingRepository: SettingRepository;
    private user;
    constructor(orderRepository: OrderRepository, settingRepository: SettingRepository, user: UserProfile);
    checkout(payment: Payment, request: Request, response: Response): Promise<object>;
    execute(request: Request, response: Response): Promise<object>;
}
