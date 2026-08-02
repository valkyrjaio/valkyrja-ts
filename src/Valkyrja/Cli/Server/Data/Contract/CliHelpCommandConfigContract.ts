/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export interface CliHelpCommandConfigContract {
    readonly helpCommandName: string;
    readonly helpOptionName: string;
    readonly helpOptionShortName: string;
}

export namespace CliHelpCommandConfigContract {
    export function instanceOf(value: unknown): value is CliHelpCommandConfigContract {
        return typeof value === 'object' && value !== null && 'helpCommandName' in value;
    }
}
