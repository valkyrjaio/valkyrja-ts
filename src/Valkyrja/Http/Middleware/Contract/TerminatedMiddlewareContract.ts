import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.js';
import type { TerminatedHandlerContract } from '../Handler/Contract/TerminatedHandlerContract.js';

export interface TerminatedMiddlewareContract {
    terminated(request: ServerRequestContract, response: ResponseContract, handler: TerminatedHandlerContract): void;
}
