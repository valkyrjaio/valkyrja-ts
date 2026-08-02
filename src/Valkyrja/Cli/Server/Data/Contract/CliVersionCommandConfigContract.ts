/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export interface CliVersionCommandConfigContract {
    readonly versionCommandName: string;
    readonly versionOptionName: string;
    readonly versionOptionShortName: string;
}

export namespace CliVersionCommandConfigContract {
    export function instanceOf(value: unknown): value is CliVersionCommandConfigContract {
        return typeof value === 'object' && value !== null && 'versionCommandName' in value;
    }
}
