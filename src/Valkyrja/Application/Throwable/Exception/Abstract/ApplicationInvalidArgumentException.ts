import { ValkyrjaInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/ValkyrjaInvalidArgumentException.js';

import type { ApplicationThrowable } from '../../Contract/ApplicationThrowable.js';

export abstract class ApplicationInvalidArgumentException extends ValkyrjaInvalidArgumentException implements ApplicationThrowable {}
