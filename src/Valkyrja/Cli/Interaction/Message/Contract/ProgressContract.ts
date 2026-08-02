/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { MessageContract } from './MessageContract.ts';

export interface ProgressContract extends MessageContract {
    isComplete(): boolean;
    withIsComplete(isComplete: boolean): this;
    getPercentage(): number;
    withPercentage(percentage: number): this;
}

export namespace ProgressContract {
    export function instanceOf(value: unknown): value is ProgressContract {
        return typeof value === 'object' && value !== null && 'isComplete' in value;
    }
}
