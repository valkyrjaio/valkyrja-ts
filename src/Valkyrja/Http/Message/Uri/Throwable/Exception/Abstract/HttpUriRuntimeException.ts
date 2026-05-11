import type { HttpUriThrowable } from '../../Contract/HttpUriThrowable.js';
import { HttpMessageRuntimeException } from '../../../../Throwable/Exception/Abstract/HttpMessageRuntimeException.js';

export abstract class HttpUriRuntimeException extends HttpMessageRuntimeException implements HttpUriThrowable {}
