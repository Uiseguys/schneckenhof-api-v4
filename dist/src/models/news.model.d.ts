import { Entity } from '@loopback/repository';
export declare class News extends Entity {
    relevantFrom: Date;
    relevantTo: Date;
    title: string;
    id: number;
    shortDescription: string;
    description: number;
    homePageDescription: string;
    showOnHome: boolean;
    startDate: Date;
    endDate: Date;
    constructor(data?: Partial<News>);
}
