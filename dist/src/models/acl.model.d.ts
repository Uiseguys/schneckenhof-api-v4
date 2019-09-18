import { Entity } from '@loopback/repository';
export declare class Acl extends Entity {
    id: number;
    model?: string;
    property?: string;
    accessType?: string;
    permission: string;
    principalType?: string;
    principalId: string;
    constructor(data?: Partial<Acl>);
}
