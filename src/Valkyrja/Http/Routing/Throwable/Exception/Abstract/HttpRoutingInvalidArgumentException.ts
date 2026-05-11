import { HttpInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpInvalidArgumentException.js';

import type { HttpRoutingThrowable } from '../../Contract/HttpRoutingThrowable.js';

export abstract class HttpRoutingInvalidArgumentException extends HttpInvalidArgumentException implements HttpRoutingThrowable {}