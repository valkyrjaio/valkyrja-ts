/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export interface CliNoInteractionConfigContract {
    readonly noInteractionOptionName: string;
    readonly noInteractionOptionShortName: string;
}

export namespace CliNoInteractionConfigContract {
    export function instanceOf(value: unknown): value is CliNoInteractionConfigContract {
        return typeof value === 'object' && value !== null && 'noInteractionOptionName' in value;
    }
}
