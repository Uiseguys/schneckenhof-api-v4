import { Entity } from '@loopback/repository';
export declare class RoleMapping extends Entity {
    id?: number;
    principalType?: string;
    principalId: number;
    roleId: number;
    constructor(data?: Partial<RoleMapping>);
}
