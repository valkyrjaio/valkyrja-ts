/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ConfigContract } from './ConfigContract.ts';

export interface HttpConfigContract extends ConfigContract {
    readonly requestReceivedMiddleware: string[];
    readonly routeMatchedMiddleware: string[];
    readonly routeNotMatchedMiddleware: string[];
    readonly routeDispatchedMiddleware: string[];
    readonly throwableCaughtMiddleware: string[];
    readonly sendingResponseMiddleware: string[];
    readonly responseSentMiddleware: string[];
}

export namespace HttpConfigContract {
    export function instanceOf(value: unknown): value is HttpConfigContract {
        return typeof value === 'object' && value !== null && 'requestReceivedMiddleware' in value;
    }
}
