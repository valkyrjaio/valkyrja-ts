import { HttpRuntimeException } from '../../../../Throwable/Exception/Abstract/HttpRuntimeException.js';

import type { HttpClientThrowable } from '../../Contract/HttpClientThrowable.js';

export abstract class HttpClientRuntimeException extends HttpRuntimeException implements HttpClientThrowable {}
