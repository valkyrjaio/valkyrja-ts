/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
