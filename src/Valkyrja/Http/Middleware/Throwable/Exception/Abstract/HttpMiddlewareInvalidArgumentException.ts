import { HttpInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpInvalidArgumentException.js';

import type { HttpMiddlewareThrowable } from '../../Contract/HttpMiddlewareThrowable.js';

export abstract class HttpMiddlewareInvalidArgumentException extends HttpInvalidArgumentException implements HttpMiddlewareThrowable {}