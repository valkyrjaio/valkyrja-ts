/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { UploadError } from '../../../../../../../src/Valkyrja/Http/Message/File/Enum/UploadError.ts';

describe('UploadError', () => {
    it('exposes the PHP upload error codes', () => {
        expect(UploadError.OK).toBe(0);
        expect(UploadError.INI_SIZE).toBe(1);
        expect(UploadError.NO_FILE).toBe(4);
        expect(UploadError.EXTENSION).toBe(8);
    });
});
