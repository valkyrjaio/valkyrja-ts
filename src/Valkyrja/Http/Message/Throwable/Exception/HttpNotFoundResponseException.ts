/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { HeaderCollectionContract } from '../../Header/Collection/Contract/HeaderCollectionContract.ts';
import { HttpResponseException } from './HttpResponseException.ts';
import { StatusCode } from '../../Enum/StatusCode.ts';

export class HttpNotFoundResponseException extends HttpResponseException {
    constructor(
        statusCode: StatusCode | null = null,
        message: string | null = null,
        headers: HeaderCollectionContract | null = null,
    ) {
        super(statusCode ?? StatusCode.NOT_FOUND, message, headers);
    }
}
