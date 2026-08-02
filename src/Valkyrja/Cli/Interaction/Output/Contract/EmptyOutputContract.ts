/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { OutputContract } from './OutputContract.ts';

export type EmptyOutputContract = OutputContract;

export namespace EmptyOutputContract {
    export function instanceOf(value: unknown): value is EmptyOutputContract {
        return typeof value === 'object' && value !== null && 'getMessages' in value;
    }
}
