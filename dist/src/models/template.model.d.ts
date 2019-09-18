import { Entity } from '@loopback/repository';
export declare class Template extends Entity {
    id: number;
    name?: string;
    originalFilename?: string;
    constructor(data?: Partial<Template>);
}
