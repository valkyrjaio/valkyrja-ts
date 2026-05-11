import type { HttpThrowable } from '../../Contract/HttpThrowable.js';
import { ValkyrjaRuntimeException } from '../../../../Throwable/Exception/Abstract/ValkyrjaRuntimeException.js';

export abstract class HttpRuntimeException extends ValkyrjaRuntimeException implements HttpThrowable {}