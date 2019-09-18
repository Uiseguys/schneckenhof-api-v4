import { Entity } from '@loopback/repository';
export declare class Setting extends Entity {
    key: string;
    value?: object;
    id: number;
    constructor(data?: Partial<Setting>);
}
