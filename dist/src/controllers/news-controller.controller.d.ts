import { Count, Filter, Where } from '@loopback/repository';
import { News } from '../models';
import { NewsRepository } from '../repositories';
import { UserProfile } from '@loopback/security';
export declare class NewsControllerController {
    newsRepository: NewsRepository;
    private user;
    constructor(newsRepository: NewsRepository, user: UserProfile);
    create(news: News): Promise<News>;
    count(where?: Where): Promise<Count>;
    find(filter?: Filter): Promise<News[]>;
    updateAll(news: News, where?: Where): Promise<Count>;
    findById(id: number): Promise<News>;
    updateById(id: number, news: News): Promise<void>;
    deleteById(id: number): Promise<void>;
}
