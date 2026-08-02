/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { UploadErrorExceptionMessage } from '../../../../../../../src/Valkyrja/Http/Message/File/Constant/UploadErrorExceptionMessage.ts';

describe('UploadErrorExceptionMessage', () => {
    it('exposes the upload error messages', () => {
        expect(UploadErrorExceptionMessage.NO_FILE_MESSAGE).toBe('No file was uploaded');
        expect(UploadErrorExceptionMessage.CANT_WRITE_MESSAGE).toBe('Failed to write file to disk');
        expect(UploadErrorExceptionMessage.OK_MESSAGE).toBe('OK is not a valid upload error');
    });
});
