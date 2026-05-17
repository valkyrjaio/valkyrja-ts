import type { HttpUriThrowable } from '../../Contract/HttpUriThrowable.js';
import { HttpMessageInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpMessageInvalidArgumentException.js';

export abstract class HttpUriInvalidArgumentException
    extends HttpMessageInvalidArgumentException
    implements HttpUriThrowable {}
