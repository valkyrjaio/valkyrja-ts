import type { UploadedFileThrowable } from '../../Contract/UploadedFileThrowable.js';
import { HttpMessageRuntimeException } from '../../../../Throwable/Exception/Abstract/HttpMessageRuntimeException.js';

export abstract class UploadedFileRuntimeException extends HttpMessageRuntimeException implements UploadedFileThrowable {}
