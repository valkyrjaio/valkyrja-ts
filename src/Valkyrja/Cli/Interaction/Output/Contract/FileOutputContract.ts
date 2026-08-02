/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { OutputContract } from './OutputContract.ts';

export interface FileOutputContract extends OutputContract {
    getFilepath(): string;
    withFilepath(filepath: string): this;
}

export namespace FileOutputContract {
    export function instanceOf(value: unknown): value is FileOutputContract {
        return typeof value === 'object' && value !== null && 'getFilepath' in value;
    }
}
