import { HttpRuntimeException } from '../../../../Throwable/Exception/Abstract/HttpRuntimeException.js';

import type { HttpRoutingThrowable } from '../../Contract/HttpRoutingThrowable.js';

export abstract class HttpRoutingRuntimeException extends HttpRuntimeException implements HttpRoutingThrowable {}