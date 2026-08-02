/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
