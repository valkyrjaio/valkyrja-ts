import { ValkyrjaRuntimeException } from '../../../../Throwable/Exception/Abstract/ValkyrjaRuntimeException.js';
import type { ValidationThrowable } from '../../Contract/ValidationThrowable.js';

export abstract class ValidationRuntimeException extends ValkyrjaRuntimeException implements ValidationThrowable {}