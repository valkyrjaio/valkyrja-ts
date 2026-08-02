/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export interface CliSilentInteractionConfigContract {
    readonly silentOptionName: string;
    readonly silentOptionShortName: string;
}

export namespace CliSilentInteractionConfigContract {
    export function instanceOf(value: unknown): value is CliSilentInteractionConfigContract {
        return typeof value === 'object' && value !== null && 'silentOptionName' in value;
    }
}
