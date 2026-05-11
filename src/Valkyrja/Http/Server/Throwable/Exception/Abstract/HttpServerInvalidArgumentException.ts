import { HttpInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpInvalidArgumentException.js';

import type { HttpServerThrowable } from '../../Contract/HttpServerThrowable.js';

export abstract class HttpServerInvalidArgumentException extends HttpInvalidArgumentException implements HttpServerThrowable {}
