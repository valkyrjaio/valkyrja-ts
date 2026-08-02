/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.ts';
import type { RequestHandlerContract } from './RequestHandlerContract.ts';

export interface ExceptionResponseRequestHandlerContract extends RequestHandlerContract {
    createResponseFromException(exception: Error): ResponseContract;
}
