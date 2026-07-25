/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ConfigContract } from './ConfigContract.ts';

export interface CliConfigContract extends ConfigContract {
    readonly applicationName: string;
    readonly defaultCommandName: string;
    readonly inputReceivedMiddleware: string[];
    readonly routeMatchedMiddleware: string[];
    readonly routeNotMatchedMiddleware: string[];
    readonly routeDispatchedMiddleware: string[];
    readonly throwableCaughtMiddleware: string[];
    readonly processExitingMiddleware: string[];
}

export namespace CliConfigContract {
    export function instanceOf(value: unknown): value is CliConfigContract {
        return typeof value === 'object' && value !== null && 'applicationName' in value;
    }
}
