/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export interface FormatContract {
    getSetCode(): string;
    withSetCode(setCode: string): this;
    getUnsetCode(): string;
    withUnsetCode(unsetCode: string): this;
}

export namespace FormatContract {
    export function instanceOf(value: unknown): value is FormatContract {
        return typeof value === 'object' && value !== null && 'getSetCode' in value;
    }
}
