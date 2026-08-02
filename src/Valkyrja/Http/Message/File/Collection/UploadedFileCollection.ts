/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { UploadedFileCollectionContract } from './Contract/UploadedFileCollectionContract.ts';
import type { UploadedFileContract } from '../Contract/UploadedFileContract.ts';
import { UploadedFileInvalidKeyException } from '../Throwable/Exception/UploadedFileInvalidKeyException.ts';
import { UploadedFileInvalidParamException } from '../Throwable/Exception/UploadedFileInvalidParamException.ts';
import { ObjectFactory } from '../../../../Type/Object/Factory/ObjectFactory.ts';

export class UploadedFileCollection implements UploadedFileCollectionContract {
    protected files: Record<string, UploadedFileContract>;

    constructor(files: Record<string, UploadedFileContract> = {}) {
        this.validateFiles(files);
        this.files = files;
    }

    has(key: string): boolean {
        return key in this.files;
    }

    get(key: string): UploadedFileContract {
        const file = this.files[key];
        if (file === undefined) {
            throw new UploadedFileInvalidKeyException(`The provided key '${key}' does not exist in the collection`);
        }
        return file;
    }

    getAll(): Record<string, UploadedFileContract> {
        return { ...this.files };
    }

    getOnly(...keys: string[]): Record<string, UploadedFileContract> {
        const result: Record<string, UploadedFileContract> = {};
        for (const [k, v] of Object.entries(this.files)) {
            if (keys.includes(k)) {
                result[k] = v;
            }
        }
        return result;
    }

    getAllExcept(...keys: string[]): Record<string, UploadedFileContract> {
        const result: Record<string, UploadedFileContract> = {};
        for (const [k, v] of Object.entries(this.files)) {
            if (!keys.includes(k)) {
                result[k] = v;
            }
        }
        return result;
    }

    with(collection: Record<string, UploadedFileContract>): this {
        this.validateFiles(collection);
        const clone = ObjectFactory.clone(this);
        clone.files = collection;
        return clone;
    }

    withAdded(collection: Record<string, UploadedFileContract>): this {
        this.validateFiles(collection);
        const clone = ObjectFactory.clone(this);
        clone.files = { ...this.files, ...collection };
        return clone;
    }

    protected validateFiles(files: Record<string, unknown>): void {
        for (const [key, file] of Object.entries(files)) {
            if (file === null || typeof file !== 'object' || !('getStream' in file)) {
                throw new UploadedFileInvalidParamException(
                    `Value for key '${key}' must be an UploadedFileContract instance`,
                );
            }
        }
    }
}
