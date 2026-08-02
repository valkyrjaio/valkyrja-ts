/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { RequestContract } from '../../../Message/Request/Contract/RequestContract.ts';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.ts';

export interface ClientContract {
    sendRequest(request: RequestContract): ResponseContract;
}
