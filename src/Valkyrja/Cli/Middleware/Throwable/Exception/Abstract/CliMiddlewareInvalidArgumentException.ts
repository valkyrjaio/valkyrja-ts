import { CliInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/CliInvalidArgumentException.js';

import type { CliMiddlewareThrowable } from '../../Contract/CliMiddlewareThrowable.js';

export abstract class CliMiddlewareInvalidArgumentException
    extends CliInvalidArgumentException
    implements CliMiddlewareThrowable {}
