/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export interface ThrowableHandlerContract {
    enable(options?: { displayErrors?: boolean }): void;
}

export namespace ThrowableHandlerContract {
    export function instanceOf(value: unknown): value is ThrowableHandlerContract {
        return typeof value === 'object' && value !== null && 'enable' in value;
    }
}
