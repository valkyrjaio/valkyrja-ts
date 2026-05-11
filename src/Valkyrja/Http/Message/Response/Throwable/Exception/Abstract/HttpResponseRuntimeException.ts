import type { HttpResponseThrowable } from '../../Contract/HttpResponseThrowable.js';
import { HttpMessageRuntimeException } from '../../../../Throwable/Exception/Abstract/HttpMessageRuntimeException.js';

export abstract class HttpResponseRuntimeException extends HttpMessageRuntimeException implements HttpResponseThrowable {}
