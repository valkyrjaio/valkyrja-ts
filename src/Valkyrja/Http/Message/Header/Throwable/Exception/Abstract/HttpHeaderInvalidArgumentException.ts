import type { HttpHeaderThrowable } from '../../Contract/HttpHeaderThrowable.js';
import { HttpMessageInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpMessageInvalidArgumentException.js';

export abstract class HttpHeaderInvalidArgumentException extends HttpMessageInvalidArgumentException implements HttpHeaderThrowable {}
