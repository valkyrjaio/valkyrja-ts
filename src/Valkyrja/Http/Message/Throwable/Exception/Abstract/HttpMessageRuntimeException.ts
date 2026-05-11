import type { HttpMessageThrowable } from '../../Contract/HttpMessageThrowable.js';
import { HttpRuntimeException } from '../../../../Throwable/Exception/Abstract/HttpRuntimeException.js';

export abstract class HttpMessageRuntimeException extends HttpRuntimeException implements HttpMessageThrowable {}
