import type { HttpHeaderThrowable } from '../../Contract/HttpHeaderThrowable.js';
import { HttpMessageRuntimeException } from '../../../../Throwable/Exception/Abstract/HttpMessageRuntimeException.js';

export abstract class HttpHeaderRuntimeException extends HttpMessageRuntimeException implements HttpHeaderThrowable {}