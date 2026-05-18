import type { UploadedFileThrowable } from '../../Contract/UploadedFileThrowable.js';
import { HttpMessageInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpMessageInvalidArgumentException.js';

export abstract class UploadedFileInvalidArgumentException
    extends HttpMessageInvalidArgumentException
    implements UploadedFileThrowable {}
