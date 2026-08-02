/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { JsonServerRequestContract } from '../../../Message/Request/Contract/JsonServerRequestContract.ts';
import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.ts';
import { HttpStructJsonServerRequestExpectedException } from '../../Throwable/Exception/HttpStructJsonServerRequestExpectedException.ts';
import { RequestStruct } from './RequestStruct.ts';

export abstract class JsonRequestStruct extends RequestStruct {
    protected getOnlyParamsFromRequest(request: ServerRequestContract, ...keys: string[]): Record<string, unknown> {
        this.ensureJsonRequest(request);

        return request.getParsedJson().getOnly(...keys);
    }

    protected getExceptParamsFromRequest(request: ServerRequestContract, ...keys: string[]): Record<string, unknown> {
        this.ensureJsonRequest(request);

        return request.getParsedJson().getAllExcept(...keys);
    }

    protected ensureJsonRequest(request: ServerRequestContract): asserts request is JsonServerRequestContract {
        if (!('getParsedJson' in request)) {
            throw new HttpStructJsonServerRequestExpectedException('JsonServerRequest is required for this to work.');
        }
    }
}
