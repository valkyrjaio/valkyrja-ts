import { EmptyResponse } from '../../Message/Response/EmptyResponse.js';

import type { RequestContract } from '../../Message/Request/Contract/RequestContract.js';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.js';
import type { ClientContract } from './Contract/ClientContract.js';

export class NullClient implements ClientContract {
    sendRequest(_request: RequestContract): ResponseContract {
        return new EmptyResponse();
    }
}
