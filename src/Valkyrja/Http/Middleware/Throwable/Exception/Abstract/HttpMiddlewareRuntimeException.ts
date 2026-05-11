import { HttpRuntimeException } from '../../../../Throwable/Exception/Abstract/HttpRuntimeException.js';

import type { HttpMiddlewareThrowable } from '../../Contract/HttpMiddlewareThrowable.js';

export abstract class HttpMiddlewareRuntimeException extends HttpRuntimeException implements HttpMiddlewareThrowable {}