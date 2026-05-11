import type { RequestContract } from '../../../Message/Request/Contract/RequestContract.js';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.js';

export interface ClientContract {
    sendRequest(request: RequestContract): ResponseContract;
}
