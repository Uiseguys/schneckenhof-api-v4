// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { inject } from '@loopback/core';
import { juggler } from '@loopback/repository';
import * as config from "./db.datasource.json";
import * as config2 from "./db.datasource.production.json";
// import * as data from "./db.datasource";
// console.log(dsConfig);
export class DbDataSource extends juggler.DataSource {
  static dataSourceName = 'db';

  constructor(
    @inject('datasources.config.db', { optional: true })
    dsConfig: object = process.env.NODE_ENV === 'production' ? config2 : config,
  ) {
    super(dsConfig);
    if (process.env.NODE_ENV === 'production') {

      console.log(typeof dsConfig);


    }
  }
}
