import { Entity } from '@loopback/repository';
export declare class Resource extends Entity {
    id?: number;
    resourceId: string;
    weblinkUrl?: string;
    originalFilename: string;
    type?: string;
    constructor(data?: Partial<Resource>);
}
