import type { HttpResponseThrowable } from '../../Contract/HttpResponseThrowable.js';
import { HttpMessageInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpMessageInvalidArgumentException.js';

export abstract class HttpResponseInvalidArgumentException
    extends HttpMessageInvalidArgumentException
    implements HttpResponseThrowable {}
