import { UploadErrorExceptionMessage } from '../../Constant/UploadErrorExceptionMessage.js';
import { UploadError } from '../../Enum/UploadError.js';
import type { UploadedFileThrowable } from '../Contract/UploadedFileThrowable.js';
import { UploadedFileInvalidUploadErrorException } from './UploadedFileInvalidUploadErrorException.js';
import { UploadedFileRuntimeException } from './Abstract/UploadedFileRuntimeException.js';

export class UploadedFileUploadErrorException extends UploadedFileRuntimeException {
    constructor(uploadError: UploadError, code: number = 0, previous: UploadedFileThrowable | null = null) {
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
