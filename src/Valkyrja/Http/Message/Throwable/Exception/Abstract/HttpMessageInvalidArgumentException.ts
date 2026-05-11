import type { HttpMessageThrowable } from '../../Contract/HttpMessageThrowable.js';
import { HttpInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpInvalidArgumentException.js';

export abstract class HttpMessageInvalidArgumentException extends HttpInvalidArgumentException implements HttpMessageThrowable {}