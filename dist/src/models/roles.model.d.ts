import { Entity } from '@loopback/repository';
export declare class Roles extends Entity {
    id: number;
    name: string;
    description: string;
    created: string;
    modified: string;
    constructor(data?: Partial<Roles>);
}
