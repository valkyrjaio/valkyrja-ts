/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
