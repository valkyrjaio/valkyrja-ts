import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.js';
import type { TerminatedMiddlewareContract } from '../../Contract/TerminatedMiddlewareContract.js';
import type { HandlerContract } from './HandlerContract.js';

export interface TerminatedHandlerContract extends HandlerContract<TerminatedMiddlewareContract> {
    terminated(request: ServerRequestContract, response: ResponseContract): void;
}
