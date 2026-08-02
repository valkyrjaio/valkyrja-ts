/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { OutputContract } from './OutputContract.ts';

export type PlainOutputContract = OutputContract;

export namespace PlainOutputContract {
    export function instanceOf(value: unknown): value is PlainOutputContract {
        return typeof value === 'object' && value !== null && 'getMessages' in value;
    }
}
