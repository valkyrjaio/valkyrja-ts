import type { HttpStreamThrowable } from '../../Contract/HttpStreamThrowable.js';
import { HttpMessageRuntimeException } from '../../../../Throwable/Exception/Abstract/HttpMessageRuntimeException.js';

export abstract class HttpStreamRuntimeException extends HttpMessageRuntimeException implements HttpStreamThrowable {}