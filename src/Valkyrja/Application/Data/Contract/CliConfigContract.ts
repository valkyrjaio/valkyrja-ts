/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
