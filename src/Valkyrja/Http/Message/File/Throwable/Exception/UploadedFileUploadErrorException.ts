/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { UploadErrorExceptionMessage } from '../../Constant/UploadErrorExceptionMessage.ts';
import { UploadError } from '../../Enum/UploadError.ts';
import type { UploadedFileThrowable } from '../Contract/UploadedFileThrowable.ts';
import { UploadedFileInvalidUploadErrorException } from './UploadedFileInvalidUploadErrorException.ts';
import { UploadedFileRuntimeException } from './Abstract/UploadedFileRuntimeException.ts';

export class UploadedFileUploadErrorException extends UploadedFileRuntimeException {
    constructor(uploadError: UploadError, _code: number = 0, _previous: UploadedFileThrowable | null = null) {
        let message: string;

        switch (uploadError) {
            case UploadError.FORM_SIZE:
                message = UploadErrorExceptionMessage.FORM_SIZE_MESSAGE;
                break;
            case UploadError.INI_SIZE:
                message = UploadErrorExceptionMessage.INI_SIZE_MESSAGE;
                break;
            case UploadError.PARTIAL:
                message = UploadErrorExceptionMessage.PARTIAL_MESSAGE;
                break;
            case UploadError.NO_FILE:
                message = UploadErrorExceptionMessage.NO_FILE_MESSAGE;
                break;
            case UploadError.NO_TMP_DIR:
                message = UploadErrorExceptionMessage.NO_TMP_DIR_MESSAGE;
                break;
            case UploadError.CANT_WRITE:
                message = UploadErrorExceptionMessage.CANT_WRITE_MESSAGE;
                break;
            case UploadError.EXTENSION:
                message = UploadErrorExceptionMessage.EXTENSION_MESSAGE;
                break;
            case UploadError.OK:
                throw new UploadedFileInvalidUploadErrorException(UploadErrorExceptionMessage.OK_MESSAGE);
        }

        super(message);
    }
}
