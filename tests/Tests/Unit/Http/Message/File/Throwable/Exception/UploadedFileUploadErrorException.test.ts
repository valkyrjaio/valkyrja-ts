/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { UploadErrorExceptionMessage } from '../../../../../../../../src/Valkyrja/Http/Message/File/Constant/UploadErrorExceptionMessage.ts';
import { UploadError } from '../../../../../../../../src/Valkyrja/Http/Message/File/Enum/UploadError.ts';
import { UploadedFileInvalidUploadErrorException } from '../../../../../../../../src/Valkyrja/Http/Message/File/Throwable/Exception/UploadedFileInvalidUploadErrorException.ts';
import { UploadedFileUploadErrorException } from '../../../../../../../../src/Valkyrja/Http/Message/File/Throwable/Exception/UploadedFileUploadErrorException.ts';

describe('UploadedFileUploadErrorException', () => {
    it.each([
        [UploadError.FORM_SIZE, UploadErrorExceptionMessage.FORM_SIZE_MESSAGE],
        [UploadError.INI_SIZE, UploadErrorExceptionMessage.INI_SIZE_MESSAGE],
        [UploadError.PARTIAL, UploadErrorExceptionMessage.PARTIAL_MESSAGE],
        [UploadError.NO_FILE, UploadErrorExceptionMessage.NO_FILE_MESSAGE],
        [UploadError.NO_TMP_DIR, UploadErrorExceptionMessage.NO_TMP_DIR_MESSAGE],
        [UploadError.CANT_WRITE, UploadErrorExceptionMessage.CANT_WRITE_MESSAGE],
        [UploadError.EXTENSION, UploadErrorExceptionMessage.EXTENSION_MESSAGE],
    ])('uses the message for upload error %s', (uploadError, message) => {
        expect(new UploadedFileUploadErrorException(uploadError).message).toBe(message);
    });

    it('rejects the OK upload error as invalid', () => {
        expect(() => new UploadedFileUploadErrorException(UploadError.OK)).toThrow(
            UploadedFileInvalidUploadErrorException,
        );
    });
});
