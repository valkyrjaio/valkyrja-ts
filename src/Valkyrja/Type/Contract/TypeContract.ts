/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export interface TypeContract {
    asValue(): unknown;
    asFlatValue(): string | number | boolean | null;
    modify(closure: (value: unknown) => unknown): this;
}
