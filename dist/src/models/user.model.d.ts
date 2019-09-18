import { Entity } from '@loopback/repository';
export declare class CustomUser extends Entity {
    settings?: object;
    id?: number;
    realm?: string;
    username: string;
    password: string;
    email: string;
    emailVerified?: boolean;
    verificationToken?: string;
    constructor(data?: Partial<CustomUser>);
}
