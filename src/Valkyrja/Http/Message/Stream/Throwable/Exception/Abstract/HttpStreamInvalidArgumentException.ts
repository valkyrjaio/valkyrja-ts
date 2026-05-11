import type { HttpStreamThrowable } from '../../Contract/HttpStreamThrowable.js';
import { HttpMessageInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpMessageInvalidArgumentException.js';

export abstract class HttpStreamInvalidArgumentException extends HttpMessageInvalidArgumentException implements HttpStreamThrowable {}
