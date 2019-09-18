import { Entity } from '@loopback/repository';
export declare class Wine extends Entity {
    type: string;
    name?: string;
    vintage?: number;
    id?: number;
    price: number;
    awardText?: string;
    awardLevel?: string;
    image: string;
    availability: boolean;
    content: number;
    varietal?: string;
    premium?: boolean;
    priority: number;
    no: number;
    alcohol: number;
    description: string;
    packagingId: number;
    constructor(data?: Partial<Wine>);
}
