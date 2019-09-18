import { Context } from '@loopback/context';
import { FindRoute, InvokeMethod, ParseParams, Reject, RequestContext, Send, SequenceHandler } from '@loopback/rest';
import { AuthenticateFn } from '@loopback/authentication';
import { LogsRepository } from './repositories';
export declare class MySequence implements SequenceHandler {
    ctx: Context;
    protected findRoute: FindRoute;
    protected parseParams: ParseParams;
    protected invoke: InvokeMethod;
    send: Send;
    reject: Reject;
    logsRepository: LogsRepository;
    protected authenticateRequest: AuthenticateFn;
    constructor(ctx: Context, findRoute: FindRoute, parseParams: ParseParams, invoke: InvokeMethod, send: Send, reject: Reject, logsRepository: LogsRepository, authenticateRequest: AuthenticateFn);
    handle(context: RequestContext): Promise<void>;
}
