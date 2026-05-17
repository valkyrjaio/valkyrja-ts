import { HttpInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpInvalidArgumentException.js';

import type { HttpClientThrowable } from '../../Contract/HttpClientThrowable.js';

export abstract class HttpClientInvalidArgumentException
    extends HttpInvalidArgumentException
    implements HttpClientThrowable {}
