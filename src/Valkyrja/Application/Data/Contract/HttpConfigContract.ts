/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
