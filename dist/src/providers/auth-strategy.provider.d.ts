import { Provider, ValueOrPromise } from '@loopback/context';
import { Strategy } from 'passport';
import { AuthenticationMetadata } from '@loopback/authentication';
import { UserRepository } from '../repositories';
export declare class MyAuthStrategyProvider implements Provider<Strategy | undefined> {
    private metadata;
    protected userRepository: UserRepository;
    constructor(metadata: AuthenticationMetadata, userRepository: UserRepository);
    value(): ValueOrPromise<Strategy | undefined>;
    verify(username: string, password: string, cb: (err: Error | null, user?: any | false) => void): void;
}
