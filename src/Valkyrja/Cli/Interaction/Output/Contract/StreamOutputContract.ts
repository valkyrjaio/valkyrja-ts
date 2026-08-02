/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { OutputContract } from './OutputContract.ts';

export interface StreamOutputContract extends OutputContract {
    getStream(): NodeJS.WritableStream;
    withStream(stream: NodeJS.WritableStream): this;
}

export namespace StreamOutputContract {
    export function instanceOf(value: unknown): value is StreamOutputContract {
        return typeof value === 'object' && value !== null && 'getStream' in value;
    }
}
