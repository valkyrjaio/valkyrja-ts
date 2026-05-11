import { HttpRuntimeException } from '../../../../Throwable/Exception/Abstract/HttpRuntimeException.js';

import type { HttpServerThrowable } from '../../Contract/HttpServerThrowable.js';

export abstract class HttpServerRuntimeException extends HttpRuntimeException implements HttpServerThrowable {}
