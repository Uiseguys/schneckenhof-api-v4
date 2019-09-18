import { WeingutApi } from './application';
import { ApplicationConfig } from '@loopback/core';
export declare function main(options?: ApplicationConfig): Promise<WeingutApi>;
export { WeingutApi };
export * from './models';
export * from './repositories';
export * from '@loopback/rest';
