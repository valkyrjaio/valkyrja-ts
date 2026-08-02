/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { LoggerContract } from '../../../Log/Logger/Contract/LoggerContract.ts';
import { EmptyResponse } from '../../Message/Response/EmptyResponse.ts';
import type { ClientContract } from './Contract/ClientContract.ts';
import type { RequestContract } from '../../Message/Request/Contract/RequestContract.ts';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.ts';

export class LogClient implements ClientContract {
    constructor(protected readonly logger: LoggerContract) {}

    sendRequest(request: RequestContract): ResponseContract {
        const optionsString = JSON.stringify(request);

        this.logger.info(
            `${LogClient.name} request: ${request.getMethod()}, uri ${request.getUri().toString()}, options ${optionsString}`,
        );

        return new EmptyResponse();
    }
}
