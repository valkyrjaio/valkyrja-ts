/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export interface CliQuietInteractionConfigContract {
    readonly quietOptionName: string;
    readonly quietOptionShortName: string;
}

export namespace CliQuietInteractionConfigContract {
    export function instanceOf(value: unknown): value is CliQuietInteractionConfigContract {
        return typeof value === 'object' && value !== null && 'quietOptionName' in value;
    }
}
