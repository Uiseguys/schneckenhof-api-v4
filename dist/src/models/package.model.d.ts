import { Entity } from '@loopback/repository';
export declare class Package extends Entity {
    displayName: string;
    measure: number;
    unitOfMeasure: string;
    id: number;
    idInjection: false;
    constructor(data?: Partial<Package>);
}
