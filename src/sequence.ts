// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Context, inject} from '@loopback/context';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
    Route
} from '@loopback/rest';

import {AuthenticationBindings, AuthenticateFn} from '@loopback/authentication';

import {
  repository
} from '@loopback/repository';

import {LogsRepository} from './repositories';


const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {
  constructor(
    @inject(RestBindings.Http.CONTEXT) public ctx: Context,
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @repository(LogsRepository)public logsRepository: LogsRepository,
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn,
  ) {}

  async handle(context: RequestContext) {
    var sendDate = (new Date()).getTime()
    try {
      const {request, response} = context;
      const route = this.findRoute(request);
      if (!(route instanceof Route)) {
        await this.authenticateRequest(request);
      }
      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      var recieveDate = (new Date()).getTime();
      var responseTimeMs = recieveDate - sendDate;
      let createjson = {
        id:Math.floor(1000 + Math.random() * 9000),
        hostname: request.hostname,
        url:request.url,
        APIResponseTime:{responsetime:responseTimeMs},
        OverallResponseTime:responseTimeMs.toString(),
        msg:"",
        time:new Date()
      }
      this.logsRepository.create(createjson);
      this.send(response, result);
    } catch (error) {
      this.reject(context, error);
    }
  }
}
