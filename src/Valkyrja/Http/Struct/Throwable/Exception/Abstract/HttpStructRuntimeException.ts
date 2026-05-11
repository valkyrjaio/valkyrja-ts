import type { HttpStructThrowable } from '../../Contract/HttpStructThrowable.js';
import { HttpRuntimeException } from '../../../../Throwable/Exception/Abstract/HttpRuntimeException.js';

export abstract class HttpStructRuntimeException extends HttpRuntimeException implements HttpStructThrowable {}