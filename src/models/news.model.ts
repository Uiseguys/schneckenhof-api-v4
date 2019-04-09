import { Entity, model, property, RepositoryMixin, RepositoryMixinDoc } from '@loopback/repository';

@model()
export class News extends Entity {
    @property({
        type: 'date',
        required: true,
    })
    relevantFrom: Date;

    @property({
        type: 'date',
        required: true,
    })
    relevantTo: Date;

    @property({
        type: 'string',
        required: true
    })
    title: string;

    @property({
        type: 'number',
        id: true,
        default: 0
    })
    id: number;

    @property({
        type: 'string',
        required: false,
    })
    shortDescription: string;

    @property({
        type: 'string',
        required: false
    })
    description: number;

    @property({
        type: 'string',
        required: false,
        default:""
    })
    homePageDescription: string;


    @property({
        type: 'boolean',
        required: false,
        default: false
    })
    showOnHome: boolean;

    @property({
        type: 'date',
        required: true,
    })
    startDate: Date;

    @property({
        type: 'date',
        required: true,
    })
    endDate: Date;

    constructor(data?: Partial<News>) {
        super(data);
    }
}
