/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { UploadedFileContract } from '../../Contract/UploadedFileContract.ts';

export interface UploadedFileCollectionContract {
    has(key: string): boolean;
    get(key: string): UploadedFileContract;
    getAll(): Record<string, UploadedFileContract>;
    getOnly(...keys: string[]): Record<string, UploadedFileContract>;
    getAllExcept(...keys: string[]): Record<string, UploadedFileContract>;
    with(collection: Record<string, UploadedFileContract>): this;
    withAdded(collection: Record<string, UploadedFileContract>): this;
}
