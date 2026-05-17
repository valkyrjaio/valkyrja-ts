import type { HttpRequestThrowable } from '../../Contract/HttpRequestThrowable.js';
import { HttpMessageInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpMessageInvalidArgumentException.js';

export abstract class HttpRequestInvalidArgumentException
    extends HttpMessageInvalidArgumentException
    implements HttpRequestThrowable {}
