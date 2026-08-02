/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export interface ArgumentContract {
    getValue(): string;
    withValue(value: string): this;
}

export namespace ArgumentContract {
    export function instanceOf(value: unknown): value is ArgumentContract {
        return typeof value === 'object' && value !== null && 'getValue' in value;
    }
}
