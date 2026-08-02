/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { EmptyResponse } from '../../Message/Response/EmptyResponse.ts';

import type { RequestContract } from '../../Message/Request/Contract/RequestContract.ts';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.ts';
import type { ClientContract } from './Contract/ClientContract.ts';

export class NullClient implements ClientContract {
    sendRequest(_request: RequestContract): ResponseContract {
        return new EmptyResponse();
    }
}
