import { CliRuntimeException } from '../../../../Throwable/Exception/Abstract/CliRuntimeException.js';

import type { CliMiddlewareThrowable } from '../../Contract/CliMiddlewareThrowable.js';

export abstract class CliMiddlewareRuntimeException extends CliRuntimeException implements CliMiddlewareThrowable {}
