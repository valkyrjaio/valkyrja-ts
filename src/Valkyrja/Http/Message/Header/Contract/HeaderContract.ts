/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ValueContract } from '../Value/Contract/ValueContract.ts';

export interface HeaderContract {
    getName(): string;
    getNormalizedName(): string;
    withName(name: string): this;
    getValues(): Array<ValueContract | string>;
    withValues(...values: Array<ValueContract | string>): this;
    withAddedValues(...values: Array<ValueContract | string>): this;
    getHeaderLine(): string;
    toString(): string;
}
