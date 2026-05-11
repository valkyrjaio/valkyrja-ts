import { ValkyrjaRuntimeException } from '../../../../Throwable/Exception/Abstract/ValkyrjaRuntimeException.js';

import type { ApplicationThrowable } from '../../Contract/ApplicationThrowable.js';

export abstract class ApplicationRuntimeException extends ValkyrjaRuntimeException implements ApplicationThrowable {}
