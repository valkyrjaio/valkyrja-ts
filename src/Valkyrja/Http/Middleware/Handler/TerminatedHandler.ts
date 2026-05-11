import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.js';
import type { TerminatedMiddlewareContract } from '../Contract/TerminatedMiddlewareContract.js';
import { Handler } from './Abstract/Handler.js';
import type { TerminatedHandlerContract } from './Contract/TerminatedHandlerContract.js';

export class TerminatedHandler extends Handler<TerminatedMiddlewareContract> implements TerminatedHandlerContract {
    terminated(request: ServerRequestContract, response: ResponseContract): void {
        const next = this.next;

        if (next !== null) {
            this.getMiddleware(next).terminated(request, response, this);
        }
    }
}
