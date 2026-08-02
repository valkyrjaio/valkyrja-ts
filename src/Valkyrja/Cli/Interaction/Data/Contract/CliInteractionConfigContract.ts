/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export interface CliInteractionConfigContract {
    isQuiet: boolean;
    isInteractive: boolean;
    isSilent: boolean;
}

export namespace CliInteractionConfigContract {
    export function instanceOf(value: unknown): value is CliInteractionConfigContract {
        return typeof value === 'object' && value !== null && 'isQuiet' in value;
    }
}
