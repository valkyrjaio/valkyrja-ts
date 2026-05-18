import { ValkyrjaInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/ValkyrjaInvalidArgumentException.js';
import type { ValidationThrowable } from '../../Contract/ValidationThrowable.js';

export abstract class ValidationInvalidArgumentException
    extends ValkyrjaInvalidArgumentException
    implements ValidationThrowable {}
