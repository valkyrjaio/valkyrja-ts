/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { UploadedFileCollection } from '../../../../../../../src/Valkyrja/Http/Message/File/Collection/UploadedFileCollection.ts';
import { UploadedFile } from '../../../../../../../src/Valkyrja/Http/Message/File/UploadedFile.ts';
import { UploadedFileInvalidKeyException } from '../../../../../../../src/Valkyrja/Http/Message/File/Throwable/Exception/UploadedFileInvalidKeyException.ts';
import { UploadedFileInvalidParamException } from '../../../../../../../src/Valkyrja/Http/Message/File/Throwable/Exception/UploadedFileInvalidParamException.ts';

const avatar = new UploadedFile('/tmp/avatar');
const banner = new UploadedFile('/tmp/banner');

describe('UploadedFileCollection', () => {
    it('looks up files by key', () => {
        const collection = new UploadedFileCollection({ avatar, banner });

        expect(collection.has('avatar')).toBe(true);
        expect(collection.has('missing')).toBe(false);
        expect(collection.get('avatar')).toBe(avatar);
        expect(() => collection.get('missing')).toThrow(UploadedFileInvalidKeyException);
    });

    it('filters files with getAll, getOnly, and getAllExcept', () => {
        const collection = new UploadedFileCollection({ avatar, banner });

        expect(Object.keys(collection.getAll())).toHaveLength(2);
        expect(collection.getOnly('avatar')).toStrictEqual({ avatar });
        expect(collection.getAllExcept('avatar')).toStrictEqual({ banner });
    });

    it('replaces and merges files immutably', () => {
        const collection = new UploadedFileCollection({ avatar });

        expect(collection.with({ banner }).getAll()).toStrictEqual({ banner });
        expect(collection.withAdded({ banner }).getAll()).toStrictEqual({ avatar, banner });
        expect(collection.getAll()).toStrictEqual({ avatar });
    });

    it('rejects values that are not uploaded files', () => {
        expect(() => new UploadedFileCollection({ bad: 'nope' as never })).toThrow(UploadedFileInvalidParamException);
    });
});
