import type { HttpStructThrowable } from '../../Contract/HttpStructThrowable.js';
import { HttpInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpInvalidArgumentException.js';

export abstract class HttpStructInvalidArgumentException extends HttpInvalidArgumentException implements HttpStructThrowable {}