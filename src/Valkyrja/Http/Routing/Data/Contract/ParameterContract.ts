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
    getRegex(): string;
    withRegex(regex: string): this;
    hasCast(): boolean;
    getCast(): Cast;
    withCast(cast: Cast): this;
    isOptional(): boolean;
    withIsOptional(isOptional: boolean): this;
    shouldCapture(): boolean;
    withShouldCapture(shouldCapture: boolean): this;
    getDefault(): unknown;
    withDefault(defaultValue?: unknown): this;
    getValue(): unknown;
    withValue(value?: unknown): this;
}
