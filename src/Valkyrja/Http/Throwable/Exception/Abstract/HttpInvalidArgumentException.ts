import type { HttpThrowable } from '../../Contract/HttpThrowable.js';
import { ValkyrjaInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/ValkyrjaInvalidArgumentException.js';

export abstract class HttpInvalidArgumentException extends ValkyrjaInvalidArgumentException implements HttpThrowable {}