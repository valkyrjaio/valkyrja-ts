import type { LoggerContract } from '../../../Log/Logger/Contract/LoggerContract.js';
import { EmptyResponse } from '../../Message/Response/EmptyResponse.js';
import type { ClientContract } from './Contract/ClientContract.js';
import type { RequestContract } from '../../Message/Request/Contract/RequestContract.js';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.js';

export class LogClient implements ClientContract {
    constructor(protected readonly logger: LoggerContract) {}

    sendRequest(request: RequestContract): ResponseContract {
        const optionsString = JSON.stringify(request);

        this.logger.info(
            `${LogClient.name} request: ${request.getMethod()}, uri ${request.getUri().toString()}, options ${optionsString}`
        );

        return new EmptyResponse();
    }
}
