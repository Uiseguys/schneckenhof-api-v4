
import { WeingutApi } from './application';
import { ApplicationConfig } from '@loopback/core';
import { dsMigrate, dsUpdate } from './migrate';

export async function main(options: ApplicationConfig = {}) {
  const app = new WeingutApi(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  await dsUpdate(app);

  return app;
}

// re-exports for our benchmark, not needed for the tutorial itself
export { WeingutApi };

export * from './models';
export * from './repositories';
export * from '@loopback/rest';
