import { Entity } from '@loopback/repository';
export declare class Logs extends Entity {
    id: number;
    hostname: string;
    url: string;
    APIResponseTime?: object;
    OverallResponseTime?: string;
    msg?: string;
    time?: Date;
    constructor(data?: Partial<Logs>);
}
