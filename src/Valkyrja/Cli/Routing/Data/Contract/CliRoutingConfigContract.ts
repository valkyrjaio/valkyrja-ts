/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export interface CliRoutingConfigContract {
    readonly dataClassName: string;
}

export namespace CliRoutingConfigContract {
    export function instanceOf(value: unknown): value is CliRoutingConfigContract {
        return typeof value === 'object' && value !== null && 'dataClassName' in value;
    }
}
