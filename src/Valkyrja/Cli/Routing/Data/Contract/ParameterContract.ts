/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { Cast } from '../../../../Type/Data/Cast.ts';

export interface ParameterContract {
    getName(): string;
    withName(name: string): this;
    hasCast(): boolean;
    getCast(): Cast;
    withCast(cast: Cast): this;
    withoutCast(): this;
    getDescription(): string;
    withDescription(description: string): this;
    getCastValues(): unknown[];
    hasFirstValue(): boolean;
    getFirstValue(): string;
    areValuesValid(): boolean;
    validateValues(): this;
}

export namespace ParameterContract {
    export function instanceOf(value: unknown): value is ParameterContract {
        return typeof value === 'object' && value !== null && 'getName' in value;
    }
}
