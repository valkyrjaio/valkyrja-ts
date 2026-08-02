/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.ts';
import { RequestStruct } from './RequestStruct.ts';

export abstract class QueryRequestStruct extends RequestStruct {
    protected getOnlyParamsFromRequest(request: ServerRequestContract, ...keys: string[]): Record<string, unknown> {
        return request.getQueryParams().getOnly(...keys);
    }

    protected getExceptParamsFromRequest(request: ServerRequestContract, ...keys: string[]): Record<string, unknown> {
        return request.getQueryParams().getAllExcept(...keys);
    }
}
