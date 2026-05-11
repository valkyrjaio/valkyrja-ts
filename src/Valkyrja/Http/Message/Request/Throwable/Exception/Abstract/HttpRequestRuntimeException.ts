import type { HttpRequestThrowable } from '../../Contract/HttpRequestThrowable.js';
import { HttpMessageRuntimeException } from '../../../../Throwable/Exception/Abstract/HttpMessageRuntimeException.js';

export abstract class HttpRequestRuntimeException extends HttpMessageRuntimeException implements HttpRequestThrowable {}
